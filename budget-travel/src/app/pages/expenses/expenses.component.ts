import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../../services/expenses.service';
import { switchMap, take } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category.model';
import { Expense } from '../../models/expense.model';
import { CurrencyPipe } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-expenses',
  imports: [CurrencyPipe, MaterialModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent implements OnInit {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly categoriesService: CategoriesService
  ) {}

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  expenses: Expense[] = [];
  expensesToCategoriesMap: { [key: number]: Expense[] } = {};
  categoryChartData: any[] = [];

  ngOnInit(): void {
    this.loadExpensesAndCategories();
  }

  loadExpensesAndCategories() {
    this.categoriesService
      .getCategories()
      .pipe(
        take(1),
        switchMap((categories) => {
          this.categories = categories;
          return this.expensesService.getExpenses();
        }),
        take(1)
      )
      .subscribe({
        next: (expenses) => {
          this.expenses = expenses;
          expenses.forEach((expense) => {
            const category = this.categories.find(
              (cat) => cat.id === expense.category
            );
            if (category) {
              if (!this.expensesToCategoriesMap[expense.category]) {
                this.expensesToCategoriesMap[expense.category] = [];
              }
              this.expensesToCategoriesMap[expense.category].push(expense);
            }
            this.filteredCategories = this.getFilteredCategories();
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getFilteredCategories() {
    return this.categories.filter(
      (category) => this.expensesToCategoriesMap[category.id]?.length > 0
    );
  }
}
