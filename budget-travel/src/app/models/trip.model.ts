import { Budget } from './budgets.model';
import { CategoryBudget } from './category.model';

export interface Trip {
  _id: string;
  name: string;
  destination?: string;
  startDate: Date;
  endDate: Date;
  budget: string;
}

export interface TripDetails {
  _id: string;
  name: string;
  destination?: string;
  startDate: Date;
  endDate: Date;
  budget: Budget;
}

export interface TripPostRequest {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  currency: string;
  totalBudget: number;
  categoryBreakdown: CategoryBudget[];
}
