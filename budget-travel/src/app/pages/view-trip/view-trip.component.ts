import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TripFacadeService } from '../../services/trips/trip-facade.service';
import { AlertService } from '../../services/shared/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TripDetails } from '../../models/trip.model';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { CommonModule } from '@angular/common';
import { Budget } from '../../models/budgets.model';
import { Expense, ExpenseStatistics } from '../../models/expense.model';
import { CategoriesService } from '../../services/shared/categories.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CategoryMapperPipe } from '../../pipes/category-mapper.pipe';

@Component({
  selector: 'app-view-trip',
  imports: [MaterialModule, CommonModule, CategoryMapperPipe],
  templateUrl: './view-trip.component.html',
  styleUrl: './view-trip.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewTripComponent implements OnInit {
  trip!: TripDetails;
  tripId!: string;
  budget!: Budget;
  isLoading = false;
  stats!: ExpenseStatistics;
  categoryBreakdownData: object[] = [];
  dataSource!: MatTableDataSource<Expense>;
  displayedColumns: string[] = [
    'description',
    'date',
    'amount',
    'currency',
    'category',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly tripFacadeService: TripFacadeService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly categoriesService: CategoriesService,
    private readonly alertService: AlertService
  ) {}

  ngOnInit(): void {
    const tripId = this.activatedRoute.snapshot.paramMap.get('id');
    if (tripId) {
      this.tripId = tripId;
      this.getTripDetails();
    }
  }

  getTripDetails(): void {
    this.isLoading = true;
    this.tripFacadeService.getTripDetails(this.tripId).subscribe({
      next: (trip) => {
        this.trip = trip;
        this.budget = trip.budget;
        this.dataSource = new MatTableDataSource(this.budget.expenses);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.calculateStats();
        this.calculateCategoryBreakdown();
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.error(error.message);
        this.isLoading = false;
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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addExpense(): void {}
}
