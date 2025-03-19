import { CategoryBudget } from './category.model';

export interface Budget {
  name: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  categoryBudgets?: CategoryBudget[];
  isActive: boolean;
  totalSpent: number;
  _id: string;
}

export interface BudgetPostRequest {
  budgetName: string;
  budgetTarget: number;
  budgetCurrency: string;
  budgetStartDate: Date;
  budgetEndDate: Date;
}
