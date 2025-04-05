import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../modules/material.module';
import { Observable, take } from 'rxjs';
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
  form!: FormGroup;

  currencies$!: Observable<Currency[]>;
  categories$!: Observable<Category[]>;
  budget$!: Observable<Budget[]>;
  defaultCurrency$!: Observable<Currency>;
  countryOptions: string[] = [];
  cityOptions: string[] = [];
  filteredCountryOptions: string[] = [];
  filteredCityOptions: string[] = [];

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
    this.getCountries();
    this.resetCitiesFormFieldToInitialState();
  }

  getCountries() {
    this.countriesService.getCountries().subscribe((countries: any[]) => {
      this.countryOptions = countries
        .map((country) => country?.name?.common)
        .sort((a, b) => a.localeCompare(b));
      this.filteredCountryOptions = this.countryOptions;
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
    this.countryFormControl.setValue('');
    this.resetCitiesFormFieldToInitialState();
  }

  resetCitySelected(): void {
    this.cityFormControl.reset();
  }

  resetCitiesFormFieldToInitialState(): void {
    this.cityFormControl.disable();
    this.cityOptions = [];
    this.filteredCityOptions = [];
  }

  onCountrySelected(country: string): void {
    this.cityFormControl.reset();
    this.cityFormControl.enable();
    this.cityOptions = [];
    this.countriesService
      .getCitiesByCountry(country)
      .pipe(take(1))
      .subscribe({
        next: (cities) => (this.cityOptions = cities),
        error: (error) => console.error(error),
      });
  }

  onCitySelected(city: string): void {}

  onCountryInput(value: string): void {
    this.filteredCountryOptions = value
      ? this.countryOptions.filter((country) =>
          country.toLowerCase().includes(value.toLowerCase())
        )
      : this.countryOptions;
  }

  onCityInput(value: string): void {
    this.filteredCityOptions = value
      ? this.cityOptions.filter((city) =>
          city.toLowerCase().includes(value.toLowerCase())
        )
      : this.cityOptions;
  }

  get countryFormControl(): FormControl {
    return this.form.get('location')?.get('country') as FormControl;
  }

  get cityFormControl(): FormControl {
    return this.form.get('location')?.get('city') as FormControl;
  }
}
