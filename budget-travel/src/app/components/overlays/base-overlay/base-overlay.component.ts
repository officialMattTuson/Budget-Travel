import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayService } from '../../../services/overlay.service';
import { OverlayResult } from '../../../models/overlay-result.model';
import { DataCacheService } from '../../../services/data-cache.service';
import { Observable } from 'rxjs';
import { CategoriesService } from '../../../services/categories.service';
import { Category } from '../../../models/category.model';
import { Currency } from '../../../models/currency.model';
import { Budget } from '../../../models/budgets.model';

@Component({
  selector: 'app-base-overlay',
  imports: [],
  templateUrl: './base-overlay.component.html',
  styleUrl: './base-overlay.component.scss',
})
export abstract class BaseOverlayComponent {
  @Output() result = new EventEmitter<OverlayResult>();

  form: FormGroup = new FormGroup({});
  currencies$!: Observable<Currency[]>;
  categories$!: Observable<Category[]>;
  budget$!: Observable<Budget[]>;
  defaultCurrency$!: Observable<Currency>;

  constructor(
    protected readonly fb: FormBuilder,
    protected readonly overlayService: OverlayService,
    protected readonly dataCache: DataCacheService,
    protected readonly categoryService: CategoriesService
  ) {
    this.initializeForm();
    this.budget$ = this.dataCache.budgets$;
    this.currencies$ = this.dataCache.getCurrencies();
    this.categories$ = this.categoryService.categories$;
    this.defaultCurrency$ = this.dataCache.defaultCurrency$;
  }

  protected abstract initializeForm(): void;

  protected submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.emitResult('submitted', this.form.value);
  }

  protected updateForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.emitResult('updated', this.form.value);
  }
  cancel(): void {
    this.emitResult('cancelled');
  }

  private emitResult(
    status: 'submitted' | 'updated' | 'cancelled',
    data?: object
  ): void {
    this.result.emit({ status, data });
    this.overlayService.close();
  }
}
