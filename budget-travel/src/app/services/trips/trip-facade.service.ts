import { Injectable } from '@angular/core';
import { TripService } from './trip.service';
import { AlertService } from '../shared/alert.service';
import { BehaviorSubject, catchError, take, tap, throwError } from 'rxjs';
import { Trip, TripPostRequest } from '../../models/trip.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TripFacadeService {
  private readonly _trips = new BehaviorSubject<Trip[]>([]);
  public trips$ = this._trips.asObservable();
  constructor(
    private readonly tripService: TripService,
    private readonly alertService: AlertService
  ) {}

  getTrips() {
    return this.tripService.getTrips();
  }

  addTrip(trip: TripPostRequest): void {
    this.tripService
      .addTrip(trip)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.alertService.success('Trip added successfully');
          this.tripService.getTrips();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.error(error.message);
        },
      });
  }

  getTripDetails(tripId: string) {
    return this.tripService.getTripDetails(tripId);
  }

  deleteTrip(tripId: string) {
    return this.tripService.deleteTrip(tripId).pipe(
      tap(() => {
        this.alertService.success('Trip deleted successfully');
      }),
      catchError((error: HttpErrorResponse) => {
        this.alertService.error(error.message);
        return throwError(() => error);
      })
    );
  }

  updateTrip(tripId: string, trip: any) {
    return this.tripService.updateTrip(tripId, trip).pipe(
      tap(() => {
        this.alertService.success('Trip updated successfully');
      }),
      catchError((error: HttpErrorResponse) => {
        this.alertService.error(error.message);
        return throwError(() => error);
      })
    );
  }
}
