export interface Trip {
  _id: string;
  name: string;
  city?: string;
  destinations?: string[];
  startDate: Date;
  endDate: Date;
  budgets: [string];
}
