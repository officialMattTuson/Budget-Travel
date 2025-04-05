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
import { CountriesService } from '../../../services/expenses/countries.service';

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
  countryOptions: string[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly budgetFacadeService: BudgetFacadeService,
    private readonly currencyService: CurrencyService,
    private readonly categoryService: CategoriesService,
    private readonly countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.budget$ = this.budgetFacadeService.budgets$;
    this.currencies$ = this.currencyService.getCurrencies();
    this.categories$ = this.categoryService.categories$;
    this.defaultCurrency$ = this.currencyService.defaultCurrency$;
    this.countriesService.getCountries().subscribe((countries: any[]) => {
      this.countryOptions = countries
        .map((country) => country?.name?.common)
        .sort((a, b) => a.localeCompare(b));
    });
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

  resetCountrySelected(): void {
    this.form.get('location')?.get('country')?.setValue('');
  }

  onCountrySelected(country: string): void {
    console.log(country)
    this.countriesService.getCitiesByCountry(country).subscribe((cities) => {
      console.log(cities)
    })
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
