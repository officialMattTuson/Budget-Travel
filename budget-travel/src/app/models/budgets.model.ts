import { CategoryBudget } from "./category.model";

export interface Budget {
  amount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  categoryBudgets: CategoryBudget[];
  _id?: string;
}
