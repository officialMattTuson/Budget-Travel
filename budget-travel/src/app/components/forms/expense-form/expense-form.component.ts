import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../modules/material.module';
import {
  Coordinates,
  Location,
  CoordinatesWithZoom,
} from '../../../models/location.model';
import { ExpensePostRequest } from '../../../models/expense.model';
import { ExpenseForm } from './expense.form';
import { AlertService } from '../../../services/shared/alert.service';
import { CountriesService } from '../../../services/expenses/countries.service';
import { LocationService } from '../../../services/mapbox/location.service';
import { CurrencyService } from '../../../services/shared/currency.service';
import { CategoriesService } from '../../../services/shared/categories.service';
import { Observable, take } from 'rxjs';
import { Budget } from '../../../models/budgets.model';
import { Category } from '../../../models/category.model';
import { Currency } from '../../../models/currency.model';
import { BudgetFacadeService } from '../../../services/budgets/budget-facade.service';
import { ErrorMessagePipe } from '../../../pipes/error-message.pipe';

interface Country {
  name: string;
  currencies: string[];
  coordinates: Coordinates;
}

@Component({
  selector: 'app-expense-form',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    ErrorMessagePipe,
  ],
  templateUrl: './expense-form.component.html',
})
export class ExpenseFormComponent implements OnInit, OnChanges {
  @Input() budgetId!: string;
  @Input() locationDetails!: Location;
  @Output() onValidFormSubmission = new EventEmitter<ExpensePostRequest>();
  @Output() onEmitCoordinates = new EventEmitter<Coordinates>();
  @Output() onEmitCoordinatesWithInstruction =
    new EventEmitter<CoordinatesWithZoom>();

  currencies$!: Observable<Currency[]>;
  categories$!: Observable<Category[]>;
  budget$!: Observable<Budget[]>;
  defaultCurrency$!: Observable<Currency>;
  form!: FormGroup;

  countryOptions: Country[] = [];
  cityOptions: string[] = [];
  filteredCountryOptions: Country[] = [];
  filteredCityOptions: string[] = [];
  currenciesOfSelectedCountry: string[] = [];
  loadingCountries = true;
  loadingCities = false;

  constructor(
    private readonly budgetFacadeService: BudgetFacadeService,
    private readonly currencyService: CurrencyService,
    private readonly categoryService: CategoriesService,
    private readonly alertService: AlertService,
    private readonly countriesService: CountriesService,
    private readonly locationService: LocationService
  ) {
    this.budget$ = this.budgetFacadeService.budgets$;
    this.currencies$ = this.currencyService.getCurrencies();
    this.categories$ = this.categoryService.categories$;
    this.defaultCurrency$ = this.currencyService.defaultCurrency$;
  }

  ngOnInit(): void {
    this.form = new ExpenseForm();
    this.prefillDate();
    this.prefillBudget(this.budgetId);
    this.getCountries();
    this.resetCitiesFormFieldToInitialState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locationDetails'] && this.form) {
      this.locationDetails = changes['locationDetails'].currentValue;
      this.form?.get('location')?.patchValue(this.locationDetails);
      this.onCountrySelected(this.locationDetails?.country);
      this.cityFormControl.enable();
      this.cityFormControl.patchValue(this.locationDetails?.city);
      this.onEmitCoordinatesWithInstruction.emit(
        this.getCoordinatesWithZoom(this.locationDetails.coordinates, 12)
      );
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
                coordinates: country?.latlng
                  ? {
                      lat: country.latlng[0],
                      lng: country.latlng[1],
                    }
                  : { lat: 0, lng: 0 },
                currencies: country?.currencies
                  ? Object.keys(country?.currencies)
                  : [],
              };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
          this.filteredCountryOptions = this.countryOptions;
        },
        error: (error) => this.alertService.error(error),
        complete: () => (this.loadingCountries = false),
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
        error: (error) => this.alertService.error(error),
        complete: () => (this.loadingCities = false),
      });

    const selectedCountry = this.countryOptions.find(
      (country) => country.name === countryName
    );
    if (selectedCountry) {
      this.onEmitCoordinates.emit(selectedCountry.coordinates);
    }
  }

  setCountrySpecificCurrencyOptions(countryName: string) {
    this.currenciesOfSelectedCountry = [];
    const selectedCountry = this.countryOptions.find(
      (country) => country.name === countryName
    ) as Country;
    this.currenciesOfSelectedCountry = selectedCountry.currencies;
  }

  onCitySelected(city: string): void {
    const country = this.countryFormControl.value;
    if (country) {
      this.locationService
        .getCoordinatesByCityAndCountry(city, country)
        .pipe(take(1))
        .subscribe({
          next: (coordinates) => {
            this.form.get('location.coordinates')?.patchValue({
              latitude: coordinates.lat,
              longitude: coordinates.lng,
            });

            this.onEmitCoordinatesWithInstruction.emit(
              this.getCoordinatesWithZoom(coordinates, 12)
            );
          },
          error: (error) =>
            this.alertService.error('Error fetching coordinates: ' + error),
        });
    }
  }

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

  prefillDate(): void {
    const today = new Date();
    this.form.get('date')?.setValue(today);
  }

  prefillBudget(budgetId: string): void {
    this.budget$.subscribe((budgets) => {
      const matchingBudget = budgets.find((budget) => budget._id === budgetId);
      if (matchingBudget) {
        this.form.get('budgetId')?.setValue(matchingBudget._id);
      }
    });
  }

  getCoordinatesWithZoom(
    coordinates: Coordinates,
    zoom = 12
  ): CoordinatesWithZoom {
    return {
      lat: coordinates.lat,
      lng: coordinates.lng,
      zoom: zoom,
    };
  }

  resetForm(): void {
    this.form.reset();
    this.prefillDate();
    this.prefillBudget(this.budgetId);
    this.resetCitiesFormFieldToInitialState();
  }

  get countryFormControl(): FormControl {
    return this.form?.get('location')?.get('country') as FormControl;
  }

  get cityFormControl(): FormControl {
    return this.form?.get('location')?.get('city') as FormControl;
  }
}
