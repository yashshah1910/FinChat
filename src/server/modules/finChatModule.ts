import { Module, ObjectId, UserInfo } from "modelence/server";
import { dbExpenses } from '../stores/expenses';
import { parseUserMessage, generateResponse } from '../services/aiService';
import { 
  createExpense, 
  getExpensesByUserId, 
  getTotalSpentByUserId, 
  deleteExpensesByUserIdAndDate 
} from '../services/expenseService';
import { z } from "zod";

export default new Module("finchat", {
  stores: [dbExpenses],

  queries: {
    async getExpenses(_, { user: _user }) {
      const user = requireUser(_user);
      const expenses = await getExpensesByUserId(new ObjectId(user.id));
      return { expenses };
    },

    async getTotalSpent(_, { user: _user }) {
      const user = requireUser(_user);
      const total = await getTotalSpentByUserId(new ObjectId(user.id));
      return { total };
    }
  },

  mutations: {
    async sendMessage(args, { user: _user }) {
      const user = requireUser(_user);

      const { message } = z.object({
        message: z.string()
      }).parse(args);

      try {
        // Use AI to parse the user message
        const parsed = await parseUserMessage(message);
        
        let response: string;
        let result: any;

        switch (parsed.intent) {
          case 'record':
            if (parsed.data) {
              await createExpense({
                userId: new ObjectId(user.id),
                amount: parsed.data.amount,
                category: parsed.data.category,
                description: parsed.data.description,
                date: new Date(),
              });
              
              result = { success: true, expense: parsed.data };
              response = await generateResponse(parsed, result);
            } else {
              throw new Error('Invalid expense data');
            }
            break;

          case 'query':
            const total = await getTotalSpentByUserId(new ObjectId(user.id));
            const expenses = await getExpensesByUserId(new ObjectId(user.id));
            result = { 
              total, 
              expenses: expenses.map((exp: any) => ({
                amount: exp.amount,
                category: exp.category,
                description: exp.description,
                date: exp.date
              }))
            };
            response = await generateResponse(parsed, result);
            break;

          case 'delete':
            if (parsed.date) {
              const deleteResult = await deleteExpensesByUserIdAndDate(
                new ObjectId(user.id), 
                parsed.date
              );
              result = { deletedCount: deleteResult.deletedCount };
              response = await generateResponse(parsed, result);
            } else {
              throw new Error('Invalid date for deletion');
            }
            break;

          default:
            response = await generateResponse(parsed);
        }

        return { response, intent: parsed.intent };
      } catch (error) {
        console.error('Chat error:', error);
        throw new Error('Something went wrong processing your message.');
      }
    }
  },
});

function requireUser(user: UserInfo | null): UserInfo {
  if (!user) throw new Error("Unauthorized");
  return user;
}
