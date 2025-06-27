import { Component, OnInit } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { BaseFormComponent } from '../base-form.component';
import { MaterialModule } from '../../../modules/material.module';
import { CategoriesService } from '../../../services/shared/categories.service';
import { Category, CategoryColor } from '../../../models/category.model';
import { TripForm } from './trip.form';
import { Observable } from 'rxjs';
import { Currency } from '../../../models/currency.model';
import { CommonModule } from '@angular/common';
import { ErrorMessagePipe } from '../../../pipes/error-message.pipe';
import { CurrencyService } from '../../../services/shared/currency.service';
import { PopupService } from '../../../services/shared/popup.service';

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
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
      (this.form as TripForm).addCategoryBreakdown(categories);
    });
    this.defaultCurrency$.subscribe((currency) => {
      if (currency?.code) {
        this.form.get('currency')?.setValue(currency.code);
      }
    });
  }

  get categoryBreakdown(): FormArray {
    return (this.form as TripForm).categoryBreakdown;
  }

  getCategoryColor(index: number): string {
    const category = this.categories[index];
    return category ? CategoryColor.getColorById(category.id) : '#ccc';
  }

  submit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }
}
