import { Component, OnInit } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { BaseFormComponent } from '../base-form.component';
import { CategoriesService } from '../../../services/shared/categories.service';
import { Category, CategoryColor } from '../../../models/category.model';
import { TripForm } from './trip.form';
import { combineLatest, Observable } from 'rxjs';
import { Currency } from '../../../models/currency.model';
import { CurrencyService } from '../../../services/shared/currency.service';
import { PopupService } from '../../../services/shared/popup.service';
import { MaterialModule } from '../../../modules/material.module';
import { CommonModule } from '@angular/common';
import { ErrorMessagePipe } from '../../../pipes/error-message.pipe';

@Component({
  selector: 'app-trip-form',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    ErrorMessagePipe,
  ],
  templateUrl: './trip-form.component.html',
  styleUrl: './trip-form.component.scss',
})
export class TripFormComponent extends BaseFormComponent implements OnInit {
  categories: Category[] = [];
  currencies$!: Observable<Currency[]>;
  defaultCurrency$!: Observable<Currency>;
  today: string;
  weekOut: string;
  remainingBudget = 0;

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly currencyService: CurrencyService,
    protected override readonly popupService: PopupService
  ) {
    super(popupService);
    this.form = new TripForm();
    this.currencies$ = this.currencyService.getCurrencies();
    this.defaultCurrency$ = this.currencyService.defaultCurrency$;
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    const week = new Date(now);
    week.setDate(now.getDate() + 7);
    this.weekOut = week.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.getCategories();
    this.getDefaultCurrency();
    this.observeBudgetChanges();
    this.observeDateChanges();
  }

  getCategories(): void {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
      (this.form as TripForm).addCategoryBreakdown(categories);
    });
  }

  getDefaultCurrency(): void {
    this.defaultCurrency$.subscribe((currency) => {
      if (currency?.code) {
        this.form.get('currency')?.setValue(currency.code);
      }
    });
  }

  observeBudgetChanges(): void {
    combineLatest([
      this.form.get('totalBudget')!.valueChanges,
      this.categoryBreakdown.valueChanges,
    ]).subscribe(([totalBudget, breakdown]) => {
      const total = typeof totalBudget === 'number' ? totalBudget : 0;
      const allocated = Array.isArray(breakdown)
        ? breakdown.reduce((sum, item) => sum + (item.amount ?? 0), 0)
        : 0;
      this.remainingBudget = total - allocated;
      if (this.remainingBudget < 0) {
        this.remainingBudget = 0;
      }
    });

    const initialTotal = this.form.get('totalBudget')?.value ?? 0;
    const initialBreakdown = this.categoryBreakdown.value ?? [];
    const initialAllocated = initialBreakdown.reduce(
      (sum: number, item: { amount: number }) => sum + (item.amount ?? 0),
      0
    );
    this.remainingBudget = initialTotal - initialAllocated;
    if (this.remainingBudget < 0) {
      this.remainingBudget = 0;
    }
  }

  observeDateChanges(): void {
    this.form.get('startDate')!.valueChanges.subscribe(() => {
      this.form.get('endDate')?.updateValueAndValidity();
    });
  }

  getCategoryColor(index: number): string {
    const category = this.categories[index];
    return category ? CategoryColor.getColorById(category.id) : '#ccc';
  }

  get categoryBreakdown(): FormArray {
    return (this.form as TripForm).categoryBreakdown;
  }
}
