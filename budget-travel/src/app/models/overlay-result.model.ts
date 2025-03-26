export interface OverlayResult {
  status: string;
  data?: object;
}

export enum OverlayType {
  Budget = 'Budget',
  Expense = 'Expense',
  Event = 'Event',
}