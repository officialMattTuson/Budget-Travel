import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../modules/material.module';
import { BaseOverlayComponent } from '../base-overlay/base-overlay.component';

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
      category: this.fb.control('', Validators.required),
      budgetId: this.fb.control('', Validators.required),
      eventId: this.fb.control(''),
    });
  }

  onSubmit(): void {
    this.submitForm();
  }

  onCancel(): void {
    this.cancel();
  }
}
