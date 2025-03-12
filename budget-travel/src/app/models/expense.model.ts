export interface Expense {
  id: string;
  amount: number;
  category: string;
  currency: string;
  description: string;
  date: Date;
  recurring: boolean;
  recurrenceInterval: string;
  tripId: string;
}