import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../modules/material.module';
import { ExpenseFormComponent } from '../../../components/overlays/expense-form/expense-form.component';
import { ExpenseMapComponent } from '../../../components/map/expense-map/expense-map.component';

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
export class AddExpenseComponent {
  onCancel(): void {}

  onSubmit(): void {}
}
