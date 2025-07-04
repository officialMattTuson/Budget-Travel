import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MaterialModule } from '../../modules/material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetService } from '../../services/budgets/budget.service';
import { take } from 'rxjs';
import { Budget } from '../../models/budgets.model';
import {
  colorScheme,
  Expense,
  ExpenseStatistics,
} from '../../models/expense.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryMapperPipe } from '../../pipes/category-mapper.pipe';
import { CategoriesService } from '../../services/shared/categories.service';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';
import { BudgetFacadeService } from '../../services/budgets/budget-facade.service';
import { ExpenseMapComponent } from '../../components/map/expense-map/expense-map.component';
import { AlertService } from '../../services/shared/alert.service';
import { Pin } from '../../models/location.model';
import { ExchangeRateService } from '../../services/shared/exchange-rate.service';

@Component({
  selector: 'app-view-budget',
  imports: [
    CommonModule,
    MaterialModule,
    HeaderComponent,
    CategoryMapperPipe,
    NgxChartsModule,
    ExpenseMapComponent,
  ],
  templateUrl: './view-budget.component.html',
  styleUrl: './view-budget.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewBudgetComponent implements OnInit {
  budget!: Budget;
  budgetId!: string;

  displayedColumns: string[] = [
    'description',
    'date',
    'amount',
    'currency',
    'category',
  ];
  dataSource!: MatTableDataSource<Expense>;
  stats!: ExpenseStatistics;
  categoryBreakdownData: object[] = [];
  LegendPosition = LegendPosition;
  colorScheme = colorScheme;
  mapPins: Pin[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(Router) private readonly router: Router,
    @Inject(ActivatedRoute) private readonly activatedRoute: ActivatedRoute,
    private readonly budgetService: BudgetService,
    private readonly alertService: AlertService,
    private readonly budgetFacadeService: BudgetFacadeService,
    private readonly categoriesService: CategoriesService,
    private readonly exchangeRateService: ExchangeRateService
  ) {}

  ngOnInit(): void {
    this.getBudgetIdFromRouteParams();
    this.getBudgetById();
    this.exchangeRateService.convertCurrency('NZD', 'USD', 100).subscribe({
      next: (response) => {
        console.log('Exchange Rate:', response);
      },
      error: (error) => this.alertService.error(error.message),
    });
  }

  getBudgetIdFromRouteParams() {
    this.budgetId = this.activatedRoute.snapshot.paramMap.get('id')!;
  }

  getBudgetById() {
    this.budgetService
      .getBudgetById(this.budgetId)
      .pipe(take(1))
      .subscribe({
        next: (budget) => {
          this.budget = budget;
          this.dataSource = new MatTableDataSource(this.budget.expenses);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.setFilters();
          this.calculateStats();
          this.calculateCategoryBreakdown();
          this.mapPins = this.getPins();
        },
        error: (error) => this.alertService.error(error),
      });
  }

  setFilters() {
    this.dataSource.filterPredicate = (
      data: Expense,
      filter: string
    ): boolean => {
      const categories = this.categoriesService.getStoredCategories();
      const categoryName =
        categories.find((cat) => cat.id === data.category)?.name ?? '';

      const searchStr = [
        data.amount,
        data.currency,
        data.description,
        data.recurrenceInterval,
        categoryName,
        data.recurring ? 'yes' : 'no',
        new Date(data.date).toLocaleDateString(),
      ]
        .join(' ')
        .toLowerCase();

      return searchStr.includes(filter.trim().toLowerCase());
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openViewBudgetForm() {
    this.budgetFacadeService.openBudgetForm(this.budget);
  }

  calculateStats(): void {
    const expenses = this.budget.expenses ?? [];
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const start = new Date(this.budget.startDate);
    const end = new Date(this.budget.endDate);
    const today = new Date();
    const daysTotal = Math.max(
      1,
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
    );
    const daysLeft = Math.max(
      0,
      Math.ceil((end.getTime() - today.getTime()) / (1000 * 3600 * 24))
    );

    const categoryMap: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryMap[this.categoriesService.getCategoryNameById(e.category)] =
        (categoryMap[e.category] || 0) + e.amount;
    });

    this.stats = {
      totalExpenses: expenses.length,
      totalSpent,
      max: Math.max(...expenses.map((e) => e.amount), 0),
      mostRecent: expenses.reduce((latest, e) => {
        return new Date(e.date) > new Date(latest) ? e.date : latest;
      }, expenses[0]?.date ?? null),
      avgPerDay: totalSpent / daysTotal,
      percentSpent: (totalSpent / this.budget.amount) * 100,
      daysLeft,
      avgRemainingPerDay:
        daysLeft > 0 ? (this.budget.amount - totalSpent) / daysLeft : 0,
      isOverBudget: totalSpent > this.budget.amount,
      categoriesUsed: new Set(expenses.map((e) => e.category)).size,
      topCategory:
        Object.entries(categoryMap)
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name, value }))[0] || null,
    };
  }

  calculateCategoryBreakdown() {
    const grouped = new Map();
    this.budget.expenses.forEach((expense) => {
      const category = this.categoriesService.getCategoryNameById(
        expense.category
      );
      grouped.set(category, (grouped.get(category) || 0) + expense.amount);
    });
    this.categoryBreakdownData = Array.from(grouped.entries()).map(
      ([name, value]) => ({ name, value })
    );
  }

  formatCurrency(value: number): string {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  formatTooltip(data: { data: { name: string }; value: number }): string {
    const name = data.data.name ?? 'Unknown';
    const value = typeof data.value === 'number' ? data.value : 0;

    const formatted = `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    return `${name}: ${formatted}`;
  }

  openAddExpenseForm() {
    this.router.navigateByUrl('expenses/new');
  }

  navigateToAddExpense(): void {
    this.router.navigate([`/budgets/${this.budgetId}/expense/new`]);
  }

  getPins(): Pin[] {
    const expenses = this.budget.expenses;
    let pins: Pin[] = [];
    for (let expense of expenses) {
      if (expense.location?.coordinates) {
        const pin = this.createPin(expense);
        pins.push(pin);
      }
    }
    return pins;
  }

  createPin(expense: Expense): Pin {
    return {
      lat: expense.location.coordinates.lat,
      lng: expense.location.coordinates.lng,
      label: expense.description,
    };
  }
}
