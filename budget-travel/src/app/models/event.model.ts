export interface Event {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  homeCurrency: string;
  destinationCurrency: string;
}
