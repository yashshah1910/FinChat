import { generateText } from '@modelence/ai';

export interface ExpenseData {
  amount: number;
  category: string;
  description: string;
}

export interface ParsedIntent {
  intent: 'record' | 'query' | 'delete' | 'unknown';
  data?: ExpenseData;
  query?: string;
  date?: Date;
}

export async function parseUserMessage(message: string): Promise<ParsedIntent> {
  try {
    const response = await generateText({
      provider: 'openai',
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a personal finance assistant. Parse user input and return ONLY valid JSON (no markdown formatting, no code blocks) with the following structure:

For expense recording (e.g., "₹500 pizza", "spent 200 on groceries"):
{
  "intent": "record",
  "data": {
    "amount": number,
    "category": string (Food, Transport, Shopping, Entertainment, Bills, Healthcare, Other),
    "description": string
  }
}

For queries (e.g., "How much have I spent?", "Show my expenses"):
{
  "intent": "query",
  "query": string (description of what they want to know)
}

For deletion (e.g., "Delete records till 1st June", "Remove all expenses from last month"):
{
  "intent": "delete",
  "date": ISO date string (if specific date mentioned)
}

For unclear input:
{
  "intent": "unknown"
}

Extract amounts in any currency (₹, $, etc.) and categorize based on common expense types. Return ONLY the JSON object, no additional text or formatting.`
        },
        {
          role: 'user',
          content: message
        }
      ]
    });

    console.log('AI Response:', response.text);

    let jsonText = response.text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\s*/, '').replace(/\s*```$/, '');
    }

    console.log('Cleaned JSON:', jsonText);

    const parsed = JSON.parse(jsonText);
    
    if (parsed.date) {
      parsed.date = new Date(parsed.date);
    }
    
    return parsed;
  } catch (error) {
    console.error('Error parsing user message:', error);
    return { intent: 'unknown' };
  }
}

export async function generateResponse(intent: ParsedIntent, result?: any): Promise<string> {
  try {
    let context = '';
    
    switch (intent.intent) {
      case 'record':
        if (result?.success) {
          context = `User successfully recorded expense: ₹${intent.data?.amount} for ${intent.data?.description} (${intent.data?.category}). The expense has been saved to their database. Provide a friendly confirmation.`;
        } else {
          context = `Failed to record expense: ₹${intent.data?.amount} for ${intent.data?.description}. Provide an apologetic response.`;
        }
        break;
      case 'query':
        if (result?.expenses && result.expenses.length > 0) {
          const categoryBreakdown = result.expenses.reduce((acc: any, exp: any) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
          }, {});
          
          const expenseDetails = result.expenses.map((exp: any) => 
            `₹${exp.amount} on ${exp.description} (${exp.category})`
          ).slice(0, 10); // Show last 10 expenses
          
          context = `User asked: "${intent.query}". Their total spending is ₹${result.total || 0}. 
          
Category breakdown: ${Object.entries(categoryBreakdown).map(([cat, amt]) => `${cat}: ₹${amt}`).join(', ')}.

Recent expenses: ${expenseDetails.join(', ')}.

Provide a helpful analysis of their spending patterns and category breakdown.`;
        } else {
          context = `User asked: "${intent.query}". They haven't recorded any expenses yet. Encourage them to start tracking their expenses.`;
        }
        break;
      case 'delete':
        context = `User requested deletion${intent.date ? ` of expenses before ${intent.date.toDateString()}` : ''}. Deleted ${result?.deletedCount || 0} expense records. Confirm what was deleted.`;
        break;
      default:
        return "I'm sorry, I didn't understand that. You can record expenses like '₹500 pizza' or ask questions like 'How much have I spent?'";
    }

    const response = await generateText({
      provider: 'openai',
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a friendly personal finance assistant named FinChat. Respond in a conversational, helpful tone. Keep responses concise but informative. Use emojis sparingly but appropriately.'
        },
        {
          role: 'user',
          content: context
        }
      ]
    });

    return response.text;
  } catch (error) {
    console.error('Error generating response:', error);
    switch (intent.intent) {
      case 'record':
        return `✅ Great! I've recorded your ₹${intent.data?.amount} expense for ${intent.data?.description} under ${intent.data?.category}.`;
      case 'query':
        return `📊 You've spent a total of ₹${result?.total || 0} so far.`;
      case 'delete':
        return `🗑️ I've deleted ${result?.deletedCount || 0} expense records as requested.`;
      default:
        return "I processed your request, but couldn't generate a proper response.";
    }
  }
}
