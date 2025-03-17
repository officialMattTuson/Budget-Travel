import { Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-budget',
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './add-budget.component.html',
  styleUrl: './add-budget.component.scss',
})
export class AddBudgetComponent {
  form!: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      budgetName: this.fb.control('', Validators.required),
      budgetTarget: this.fb.control('', Validators.required),
      budgetCurrency: this.fb.control('', Validators.required),
      budgetStartDate: this.fb.control('', Validators.required),
      budgetEndDate: this.fb.control('', Validators.required),
    });
  }
}
