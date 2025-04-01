import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../modules/material.module';
import { BaseOverlayComponent } from '../base-overlay/base-overlay.component';
import { OverlayType } from '../../../models/overlay-result.model';
import { Expense } from '../../../models/expense.model';

@Component({
  selector: 'app-add-expense',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss',
})
export class AddExpenseComponent extends BaseOverlayComponent {
  @Input() buttonText = 'Submit';

  onClose(): void {
    this.overlayService.close();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      currency: this.fb.control('', Validators.required),
      amount: this.fb.control('', Validators.required),
      date: this.fb.control('', Validators.required),
      description: this.fb.control('', Validators.required),
      location: this.fb.group({
        name: this.fb.control('', Validators.required),
        address: this.fb.control(''),
        city: this.fb.control(''),
        country: this.fb.control('', Validators.required),
        coordinates: this.fb.group({
          latitude: this.fb.control('', Validators.required),
          longitude: this.fb.control('', Validators.required),
        }),
      }),
      category: this.fb.control('', Validators.required),
      budgetId: this.fb.control('', Validators.required),
      eventId: this.fb.control(''),
    });
  }

  protected autoFillForm(): void {
    if (this.type === OverlayType.Expense && this.data) {
      const formData = this.data as Expense;
      this.form.patchValue({
        description: formData.description,
        amount: formData.amount,
        currency: formData.currency,
        date: formData.date,
        category: formData.category,
        budgetId: formData.budgetId,
        eventId: formData.eventId,
      });
    }
  }

  onSubmit(): void {
    this.submitForm();
  }

  onCancel(): void {
    this.cancel();
  }
}
