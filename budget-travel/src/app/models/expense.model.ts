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

export interface ExpensePostRequest {
  name: string;
  amount: number;
  currency: string;
  description: string;
  category: string;
  budgetId?: string;
  date: Date;
  eventId?: string;
}