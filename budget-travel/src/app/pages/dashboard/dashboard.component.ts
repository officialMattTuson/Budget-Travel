import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { BudgetService } from '../../services/budgets/budget.service';
import { ExpensesService } from '../../services/expenses/expenses.service';
import { CategoriesService } from '../../services/shared/categories.service';
import { Budget } from '../../models/budgets.model';
import { CardDetailsComponent } from '../../components/card-details/card-details.component';
import { Expense } from '../../models/expense.model';
import { BudgetFacadeService } from '../../services/budgets/budget-facade.service';
import { ExpensesFacadeService } from '../../services/expenses/expenses-facade.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, MaterialModule, CardDetailsComponent],
})
export class DashboardComponent implements OnInit {
  trips: any[] = [
    { name: 'Paris', spent: 3200, currency: 'EUR' },
    { name: 'London', spent: 1200, currency: 'GBP' },
  ];
  activeBudgets: Budget[] = [];
  recentExpenses: Expense[] = [];
  exchangeData = { from: 'USD', to: 'EUR', rate: 1 };
  categoryBreakdown: any[] = [];

  constructor(
    private readonly router: Router,
    private readonly budgetService: BudgetService,
    private readonly expensesService: ExpensesService,
    private readonly budgetFacadeService: BudgetFacadeService,
    private readonly expensesFacadeService: ExpensesFacadeService,
    private readonly categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.getBudgets();
    this.getExpenses();
    this.getCategories();
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
        error: (error) => console.error('Error fetching budgets:', error),
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
        error: (error) => console.error('Error fetching expenses:', error),
      });
  }

  getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(take(1))
      .subscribe({
        next: (categories) => this.categoriesService.setCategories(categories),
        error: (error) => console.error('Error fetching categories:', error),
      });
  }

  goToExpenses() {
    this.router.navigate(['/expenses']);
  }

  goToBudgets() {
    this.router.navigate(['/budgets']);
  }
}
