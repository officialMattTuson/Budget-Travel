export interface Category {
  id: number;
  name: string;
}

export interface CategoryBudget {
  category: string;
  allocatedAmount: number;
}
