import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
import { Location } from '../../../models/location.model';

interface Country {
  name: string;
  currencies: string[];
}
@Component({
  selector: 'app-expense-form',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
})
export class ExpenseFormComponent implements OnInit, OnChanges {
  @Input() budgetId!: string;
  @Input() locationDetails!: Location;
  form!: FormGroup;

  currencies$!: Observable<Currency[]>;
  categories$!: Observable<Category[]>;
  budget$!: Observable<Budget[]>;
  defaultCurrency$!: Observable<Currency>;
  countryOptions: Country[] = [];
  cityOptions: string[] = [];
  filteredCountryOptions: Country[] = [];
  filteredCityOptions: string[] = [];
  currenciesOfSelectedCountry: string[] = [];
  loadingCountries = true;
  loadingCities = false;

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
    this.prefillBudget();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locationDetails'] && this.form) {
      this.locationDetails = changes['locationDetails'].currentValue;
      this.form?.get('location')?.patchValue(this.locationDetails);
      this.onCountrySelected(this.locationDetails?.country);
      this.cityFormControl.enable();
      this.cityFormControl.patchValue(this.locationDetails?.city);
    }
  }

  getCountries() {
    this.loadingCountries = true;
    this.countriesService
      .getCountries()
      .pipe(take(1))
      .subscribe({
        next: (countries: any[]) => {
          this.countryOptions = countries
            .map((country) => {
              return {
                name: country?.name?.common,
                currencies: country?.currencies
                  ? Object.keys(country?.currencies)
                  : [],
              };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
          this.filteredCountryOptions = this.countryOptions;
        },
        error: (error) => console.error(error),
        complete: () => (this.loadingCountries = false),
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
    this.prefillDate();
  }

  prefillDate(): void {
    const today = new Date();
    this.form.get('date')?.setValue(today);
  }

  prefillBudget(): void {
    this.budget$.pipe(take(1)).subscribe((budgets) => {
      const matchingBudget = budgets.find(
        (budget) => budget._id === this.budgetId
      );
      if (matchingBudget) {
        this.form.get('budgetId')?.setValue(matchingBudget._id);
      }
    });
  }

  resetCountrySelected(): void {
    this.countryFormControl.setValue('');
    this.currenciesOfSelectedCountry = [];
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

  onCountrySelected(countryName: string): void {
    this.cityFormControl.reset();
    this.cityFormControl.enable();
    this.cityOptions = [];
    this.loadingCities = true;
    this.setCountrySpecificCurrencyOptions(countryName);
    this.countriesService
      .getCitiesByCountry(countryName)
      .pipe(take(1))
      .subscribe({
        next: (cities) => {
          this.cityOptions = [...cities].sort((a, b) => a.localeCompare(b));
          this.filteredCityOptions = this.cityOptions;
        },
        error: (error) => console.error(error),
        complete: () => (this.loadingCities = false),
      });
  }

  setCountrySpecificCurrencyOptions(countryName: string) {
    this.currenciesOfSelectedCountry = [];
    const selectedCountry = this.countryOptions.find(
      (country) => country.name === countryName
    ) as Country;
    this.currenciesOfSelectedCountry = selectedCountry.currencies;
  }

  onCitySelected(city: string): void {}

  onCountryInput(value: string): void {
    this.filteredCountryOptions = value
      ? this.countryOptions.filter((country) =>
          country.name.toLowerCase().includes(value.toLowerCase())
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
    return this.form?.get('location')?.get('country') as FormControl;
  }

  get cityFormControl(): FormControl {
    return this.form?.get('location')?.get('city') as FormControl;
  }

  resetForm(): void {
    this.form.reset();
    this.prefillDate();
    this.prefillBudget();
    this.resetCitiesFormFieldToInitialState();
  }
}
