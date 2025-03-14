export interface Expense {
  _id: string;
  amount: number;
  category: number;
  currency: string;
  description: string;
  date: Date;
  recurring: boolean;
  recurrenceInterval: string;
  eventId: string;
  budgetId: string;
}