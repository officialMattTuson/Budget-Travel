import { Budget } from './budgets.model';

export interface Trip {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  budgetId: number;
  homeCurrency: string;
  destinationCurrency: string;
}
