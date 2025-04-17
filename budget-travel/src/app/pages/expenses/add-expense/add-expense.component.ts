import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../modules/material.module';
import { ExpenseFormComponent } from '../../../components/forms/expense-form/expense-form.component';
import { ExpenseMapComponent } from '../../../components/map/expense-map/expense-map.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Coordinates,
  CoordinatesWithZoom,
  Location,
} from '../../../models/location.model';
import { ExpensePostRequest } from '../../../models/expense.model';
import { MapSetupService } from '../../../services/mapbox/map-setup.service';
import { ExpensesFacadeService } from '../../../services/expenses/expenses-facade.service';
import { AlertService } from '../../../services/shared/alert.service';

@Component({
  selector: 'app-add-expense',
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ExpenseFormComponent,
    ExpenseMapComponent,
  ],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss',
})
export class AddExpenseComponent implements OnInit {
  budgetId!: string;
  locationDetails!: Location;
  constructor(
    private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly expenseFacadeService: ExpensesFacadeService,
    private readonly mapSetupService: MapSetupService
  ) {}

  ngOnInit(): void {
    this.budgetId = this.activatedRoute.snapshot.params['id'];
  }

  onLocationSelected(location: Location): void {
    this.locationDetails = location;
  }

  onSubmit(expense: ExpensePostRequest): void {
    this.expenseFacadeService.addNewExpense(expense).subscribe(() => {
      this.alertService.success('Expense added successfully');
      this.router.navigateByUrl(`/budgets/${this.budgetId}`);
    });
  }

  onCancel(): void {}

  onCoordinatesReceived(coordinates: Coordinates): void {
    const map = this.mapSetupService.getMapSnapshot();
    if (map) {
      map.flyTo({
        center: [coordinates.lng, coordinates.lat],
        zoom: 4,
      });
    }
  }

  onZoomCoordinatesReceived(coordinatesWithZoom: CoordinatesWithZoom): void {
    const map = this.mapSetupService.getMapSnapshot();
    if (map) {
      map.flyTo({
        center: [coordinatesWithZoom.lng, coordinatesWithZoom.lat],
        zoom: coordinatesWithZoom.zoom,
      });
    }
  }
}
