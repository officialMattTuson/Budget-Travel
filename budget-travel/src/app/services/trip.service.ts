import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private readonly apiUrl = `${environment.apiUrl}/trips`;

  constructor(private readonly http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}`);
  }

  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(`${this.apiUrl}`, trip);
  }

  getTripDetails(tripId: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${tripId}`);
  }

  deleteTrip(tripId: string): Observable<Trip> {
    return this.http.delete<Trip>(`${this.apiUrl}/${tripId}`);
  }

  updateTrip(tripId: string, trip: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiUrl}/${tripId}`, trip);
  }
}
