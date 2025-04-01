import { ScaleType } from '@swimlane/ngx-charts';

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
  location: Location;
}

export interface ExpensePostRequest {
  amount: number;
  currency: string;
  description: string;
  category: string;
  location: Location;
  budgetId?: string;
  date: Date;
  eventId?: string;
}

export interface ExpenseStatistics {
  totalExpenses: number;
  totalSpent: number;
  max: number;
  mostRecent: Date;
  avgPerDay: number;
  percentSpent: number;
  daysLeft: number;
  avgRemainingPerDay: number;
  isOverBudget: boolean;
  categoriesUsed: number;
  topCategory: {
    name: string;
    value: number;
  };
}

export const colorScheme = {
  name: 'customScheme',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: [
    '#5AA454', // Green
    '#A10A28', // Burgundy
    '#C7B42C', // Yellow/Gold
    '#AAAAAA', // Grey
    '#D84315', // Passport Stamp Red
    '#3E2723', // Passport Cover Brown
    '#795548', // Earthy Brown
    '#00796B', // Teal
    '#FFA000', // Warm Amber
    '#8D6E63', // Muted Taupe
  ],
};
