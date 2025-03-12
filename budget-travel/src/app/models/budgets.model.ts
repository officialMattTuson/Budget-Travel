export interface Budget {
  amount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  categoryBudgets: CategoryBudget[];
}

export interface CategoryBudget {
  category: string;
  allocatedAmount: number;
}