import { Component, OnInit, Injector } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { TripCardComponent } from './components/trip-card/trip-card.component';
import { Trip } from '../../models/trip.model';
import { TripService } from '../../services/trips/trip.service';
import { AlertService } from '../../services/shared/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PopupFormComponent } from '../../components/forms/popup-form/popup-form.component';
import { TripFormComponent } from '../../components/forms/trip-form/trip-form.component';

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
    private readonly alertService: AlertService,
    private readonly dialog: MatDialog,
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

  onAddTrip() {
    this.dialog.open(PopupFormComponent, {
      data: {
        formComponent: TripFormComponent,
      },
      width: '400px',
    });
  }
}
