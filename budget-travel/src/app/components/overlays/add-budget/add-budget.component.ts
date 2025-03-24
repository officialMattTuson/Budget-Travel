import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseOverlayComponent } from '../base-overlay/base-overlay.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-budget',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-budget.component.html',
  styleUrl: './add-budget.component.scss',
})
export class AddBudgetComponent extends BaseOverlayComponent {
  @Input() buttonText = 'Submit';

  onClose(): void {
    this.overlayService.close();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      budgetName: this.fb.control('', Validators.required),
      budgetTarget: this.fb.control('', Validators.required),
      budgetCurrency: this.fb.control('', Validators.required),
      budgetStartDate: this.fb.control('', Validators.required),
      budgetEndDate: this.fb.control('', Validators.required),
    });
  }

  onSubmit(): void {
    this.submitForm();
  }

  onCancel(): void {
    this.cancel();
  }
}
