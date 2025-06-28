import { CategoryBudget } from './category.model';
import { Expense } from './expense.model';

export interface Budget {
  name: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  categoryBudgets?: CategoryBudget[];
  isActive: boolean;
  totalSpent: number;
  expenses: Expense[];
  _id: string;
}

export interface BudgetPostRequest {
  name: string;
  amount: number;
  trip?: string;
  startDate: Date;
  endDate: Date;
  currency: string;
  categoryBreakdown: CategoryBudget[];
}
