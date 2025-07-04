import { Trip } from '../models/trip.model';

export const mockTrips: Trip[] = [
  {
    _id: '1',
    name: 'Summer in Paris',
    destination: 'France',
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-07-01'),
    budget: '1',
  },
  {
    _id: '2',
    name: 'Winter in UK',
    destination: 'England, Scotland',
    startDate: new Date('2025-08-01'),
    endDate: new Date('2023-09-10'),
    budget: '2',
  },
];
