import { Trip } from "../models/trip.model";

export const mockTrips: Trip[] = [
  {
    _id: '1',
    name: 'Summer in Paris',
    destinations: ['France'],
    homeCurrency: 'EUR',
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-07-01'),
    budgetId: 1,
    destinationCurrency: 'EUR',
    isActive: true,
    isCompleted: false,
  },
  {
    _id: '2',
    name: 'Winter in UK',
    destinations: ['England', 'Scotland'],
    homeCurrency: 'EUR',
    startDate: new Date('2025-08-01'),
    endDate: new Date('2023-09-10'),
    budgetId: 2,
    destinationCurrency: 'EUR',
    isActive: false,
    isCompleted: false,
  },

]