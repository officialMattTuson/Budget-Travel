export interface Trip {
  _id: string;
  name: string;
  city?: string;
  destinations?: string[];
  startDate: Date;
  endDate: Date;
  budgetId: number;
  homeCurrency: string;
  isActive?: boolean;
  isCompleted?: boolean;
  destinationCurrency: string;
}
