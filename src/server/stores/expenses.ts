import { Store, schema } from 'modelence/server';

export const dbExpenses = new Store('expenses', {
  schema: {
    userId: schema.userId(),
    amount: schema.number(),
    category: schema.string(),
    description: schema.string(),
    date: schema.date(),
    createdAt: schema.date(),
  },
  indexes: [
    { key: { userId: 1, date: -1 } },
    { key: { userId: 1, category: 1 } }
  ],
});
