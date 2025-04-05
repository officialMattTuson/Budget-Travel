import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../modules/material.module';
import { Observable } from 'rxjs';
import { Budget } from '../../../models/budgets.model';
import { Category } from '../../../models/category.model';
import { Currency } from '../../../models/currency.model';
import { BudgetFacadeService } from '../../../services/budgets/budget-facade.service';
import { CategoriesService } from '../../../services/shared/categories.service';
import { CurrencyService } from '../../../services/shared/currency.service';

@Component({
  selector: 'app-expense-form',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
})
export class ExpenseFormComponent implements OnInit {
  @Input() buttonText = 'Submit';
  @Output() countrySelected = new EventEmitter<string>();
  form!: FormGroup;

  currencies$!: Observable<Currency[]>;
  categories$!: Observable<Category[]>;
  budget$!: Observable<Budget[]>;
  defaultCurrency$!: Observable<Currency>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly budgetFacadeService: BudgetFacadeService,
    private readonly currencyService: CurrencyService,
    private readonly categoryService: CategoriesService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.budget$ = this.budgetFacadeService.budgets$;
    this.currencies$ = this.currencyService.getCurrencies();
    this.categories$ = this.categoryService.categories$;
    this.defaultCurrency$ = this.currencyService.defaultCurrency$;
  }

  initializeForm(): void {
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

  // protected autoFillForm(): void {
  //   if (this.type === OverlayType.Expense && this.data) {
  //     const formData = this.data as Expense;
  //     this.form.patchValue({
  //       description: formData.description,
  //       amount: formData.amount,
  //       currency: formData.currency,
  //       date: formData.date,
  //       category: formData.category,
  //       budgetId: formData.budgetId,
  //       eventId: formData.eventId,
  //     });
  //   }
  // }
}
