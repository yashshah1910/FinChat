import { ObjectId } from 'modelence/server';
import { dbExpenses } from '../stores/expenses';

export interface ExpenseData {
  userId: ObjectId;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export async function createExpense(data: ExpenseData) {
  try {
    const collection = (dbExpenses as any).collection;
    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
    });
    console.log('Expense created:', result.insertedId);
    return result;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
}

export async function getExpensesByUserId(userId: ObjectId) {
  try {
    const collection = (dbExpenses as any).collection;
    const expenses = await collection.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    console.log(`Found ${expenses.length} expenses for user ${userId}`);
    return expenses;
  } catch (error) {
    console.error('Error getting expenses:', error);
    throw error;
  }
}

export async function getTotalSpentByUserId(userId: ObjectId) {
  try {
    const collection = (dbExpenses as any).collection;
    const expenses = await collection.find({ userId }).toArray();
    const total = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
    console.log(`Total spent by user ${userId}: ₹${total}`);
    return total;
  } catch (error) {
    console.error('Error calculating total:', error);
    throw error;
  }
}

export async function deleteExpensesByUserIdAndDate(userId: ObjectId, beforeDate: Date) {
  try {
    const collection = (dbExpenses as any).collection;
    const result = await collection.deleteMany({ 
      userId, 
      date: { $lt: beforeDate } 
    });
    console.log(`Deleted ${result.deletedCount} expenses before ${beforeDate} for user ${userId}`);
    return result;
  } catch (error) {
    console.error('Error deleting expenses:', error);
    throw error;
  }
}
