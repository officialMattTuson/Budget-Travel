import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CardDetailsComponent } from '../../components/card-details/card-details.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MaterialModule } from '../../modules/material.module';
import { ActivatedRoute } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { take } from 'rxjs';
import { Budget, BudgetPostRequest } from '../../models/budgets.model';
import { OverlayService } from '../../services/overlay.service';
import { OverlayResult, OverlayType } from '../../models/overlay-result.model';
import { AddBudgetComponent } from '../../components/overlays/add-budget/add-budget.component';
import { mapBudgetToPostRequest } from '../../utils/mappers/budget-post-request-mapper';
import { DataCacheService } from '../../services/data-cache.service';
import {
  colorScheme,
  Expense,
  ExpenseStatistics,
} from '../../models/expense.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryMapperPipe } from '../../pipes/category-mapper.pipe';
import { CategoriesService } from '../../services/categories.service';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-view-budget',
  imports: [
    CommonModule,
    MaterialModule,
    CardDetailsComponent,
    HeaderComponent,
    CategoryMapperPipe,
    NgxChartsModule,
  ],
  templateUrl: './view-budget.component.html',
  styleUrl: './view-budget.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewBudgetComponent implements OnInit {
  budget!: Budget;

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
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly budgetService: BudgetService,
    private readonly overlayService: OverlayService,
    private readonly dataCache: DataCacheService,
    private readonly categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.getBudgetById(id);
  }

  getBudgetById(id: string) {
    this.budgetService
      .getBudgetById(id)
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
        },
        error: (error) => console.error('Error fetching budget:', error),
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
    const componentRef = this.overlayService.open(
      AddBudgetComponent,
      this.budget,
      OverlayType.Budget
    );

    if (componentRef) {
      componentRef.instance.result.subscribe((result: OverlayResult) => {
        if (!result.data) {
          return;
        }

        this.updateBudget(result.data as BudgetPostRequest);
      });
    }
  }

  updateBudget(formData: BudgetPostRequest) {
    const budgetPostObject = mapBudgetToPostRequest(formData);
    this.budgetService
      .updateBudget(budgetPostObject, this.budget._id)
      .subscribe({
        next: (addedBudget: Budget) => {
          const currentBudgets = this.dataCache.getBudgets();
          const index = currentBudgets.findIndex(
            (b) => b._id === this.budget._id
          );
          addedBudget.totalSpent = this.budget.totalSpent;
          currentBudgets[index] = addedBudget;

          this.dataCache.setBudgets(currentBudgets);
        },
        error: (error) => {
          console.error('Error updating budget:', error);
        },
      });
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
    console.log(this.categoryBreakdownData);
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
}
