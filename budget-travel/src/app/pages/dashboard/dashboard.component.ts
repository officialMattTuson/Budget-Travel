import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { BudgetService } from '../../services/budgets/budget.service';
import { ExpensesService } from '../../services/expenses/expenses.service';
import { CategoriesService } from '../../services/shared/categories.service';
import { Budget } from '../../models/budgets.model';
import { Expense } from '../../models/expense.model';
import { BudgetFacadeService } from '../../services/budgets/budget-facade.service';
import { ExpensesFacadeService } from '../../services/expenses/expenses-facade.service';
import { AlertService } from '../../services/shared/alert.service';
import { HeaderComponent } from '../../components/header/header.component';
import { SuggestionsComponent } from '../../components/suggestions/suggestions.component';
import { mockSuggestions } from '../../mocks/suggestions';
import { mockTrips } from '../../mocks/trips';
import { Trip } from '../../models/trip.model';
import { CategoryMapperPipe } from '../../pipes/category-mapper.pipe';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    MaterialModule,
    HeaderComponent,
    SuggestionsComponent,
    CategoryMapperPipe,
  ],
})
export class DashboardComponent implements OnInit {
  trips = mockTrips;
  activeTrips: Trip[] = [];
  activeBudgets: Budget[] = [];
  recentExpenses: Expense[] = [];
  categoryBreakdown: any[] = [];
  suggestions = mockSuggestions;

  constructor(
    private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly budgetService: BudgetService,
    private readonly expensesService: ExpensesService,
    private readonly budgetFacadeService: BudgetFacadeService,
    private readonly expensesFacadeService: ExpensesFacadeService,
    private readonly categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.getTrips();
    this.getBudgets();
    this.getExpenses();
    this.getCategories();
  }

  getTrips() {
    // mock function until backend is ready
    this.activeTrips = this.trips.filter((trip) => trip.isActive);
  }

  getBudgets() {
    this.budgetService
      .getBudgets()
      .pipe(take(1))
      .subscribe({
        next: (budgets) => {
          this.budgetFacadeService.setBudgets(budgets);
          budgets.forEach((budget) => {
            if (budget.isActive) {
              this.activeBudgets.push(budget);
            }
          });
        },
        error: (error) =>
          this.alertService.error('Error fetching budgets: ' + error),
      });
  }

  getExpenses() {
    this.expensesService
      .getExpenses()
      .pipe(take(1))
      .subscribe({
        next: (expenses) => {
          this.expensesFacadeService.setExpenses(expenses);
          this.recentExpenses = expenses.slice(0, 5);
        },
        error: (error) =>
          this.alertService.error('Error fetching expenses: ' + error),
      });
  }

  getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(take(1))
      .subscribe({
        next: (categories) => this.categoriesService.setCategories(categories),
        error: (error) =>
          this.alertService.error('Error fetching categories: ' + error),
      });
  }

  goToExpenses() {
    this.router.navigate(['/expenses']);
  }

  goToBudgets() {
    this.router.navigate(['/budgets']);
  }
}
