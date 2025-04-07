import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../modules/material.module';
import { ExpenseFormComponent } from '../../../components/overlays/expense-form/expense-form.component';
import { ExpenseMapComponent } from '../../../components/map/expense-map/expense-map.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '../../../models/location.model';

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
  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.budgetId = this.activatedRoute.snapshot.params['id'];
  }

  onLocationSelected(location: Location): void {
    this.locationDetails = location;
  }

  onCancel(): void {}

  onSubmit(): void {}
}
