import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';
import { Router } from '@angular/router';
import { DataCacheService } from '../../services/data-cache.service';
import { take, tap } from 'rxjs';
import { BudgetService } from '../../services/budget.service';
import { ExpensesService } from '../../services/expenses.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, MaterialModule],
})
export class DashboardComponent implements OnInit {
  trips: any[] = [
    { name: 'Paris', spent: 3200, currency: 'EUR' },
    { name: 'London', spent: 1200, currency: 'GBP' },
  ];
  budget = { total: 5000, spent: 3200 };
  recentExpenses: any[] = [];
  exchangeData = { from: 'USD', to: 'EUR', rate: 1 };
  categoryBreakdown: any[] = [];

  constructor(
    private readonly router: Router,
    private readonly dataCache: DataCacheService,
    private readonly budgetService: BudgetService,
    private readonly expensesService: ExpensesService,
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
        next: (budgets) => this.dataCache.setBudgets(budgets),
        error: (error) => console.error('Error fetching budgets:', error),
      });
  }

  getExpenses() {
    this.expensesService
      .getExpenses()
      .pipe(take(1))
      .subscribe({
        next: (expenses) => this.dataCache.setExpenses(expenses),
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
