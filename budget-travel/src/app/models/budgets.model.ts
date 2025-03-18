import { CategoryBudget } from "./category.model";

export interface Budget {
  name: string;
  amount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  categoryBudgets?: CategoryBudget[];
  _id?: string;
}
