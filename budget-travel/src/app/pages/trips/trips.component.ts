import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { TripCardComponent } from './components/trip-card/trip-card.component';
import { Trip } from '../../models/trip.model';
import { TripService } from '../../services/trips/trip.service';
import { AlertService } from '../../services/shared/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { take } from 'rxjs';

@Component({
  selector: 'app-trips',
  imports: [HeaderComponent, TripCardComponent],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss',
})
export class TripsComponent implements OnInit {
  trips: Trip[] = [];

  constructor(
    private readonly tripService: TripService,
    private readonly alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getTrips();
  }

  getTrips(): void {
    this.tripService
      .getTrips()
      .pipe(take(1))
      .subscribe({
        next: (trips) => {
          this.trips = trips;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.error(error.message);
        },
      });
  }
}
