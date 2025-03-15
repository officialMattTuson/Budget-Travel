import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../../services/expenses.service';
import { Observable, switchMap, take } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';
import { FormsModule } from '@angular/forms';
import { Event } from '../../models/event.model';
import { Expense } from '../../models/expense.model';
import { Budget } from '../../models/budgets.model';
import { CategoryMapperPipe } from '../../pipes/category-mapper.pipe';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, MaterialModule, CommonModule, CategoryMapperPipe],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  events: Event[] = [];
  budgets: Budget[] = [];
  filteredCategories: Category[] = [];
  expensesToCategoriesMap: Record<number, Expense[]> = {};

  selectedEvent = '';
  selectedBudget = '';
  selectedCategory = 0;
  viewMode = 'accordion';
  categories$: Observable<Category[]>;

  constructor(
    private readonly expensesService: ExpensesService,
    private readonly categoriesService: CategoriesService
  ) {
    this.categories$ = this.categoriesService.categories$;
  }

  ngOnInit(): void {
    this.loadExpensesAndCategories();
  }

  private loadExpensesAndCategories(): void {
    this.categoriesService
      .getCategories()
      .pipe(
        take(1),
        switchMap((categories) => {
          this.categoriesService.setCategories(categories);
          return this.expensesService.getExpenses();
        }),
        take(1)
      )
      .subscribe({
        next: (expenses) => {
          this.expenses = expenses;
          this.mapExpensesToCategories(this.expenses);
          this.filterExpenses();
        },
        error: console.error,
      });
  }

  private mapExpensesToCategories(expenses: Expense[]): void {
    this.expensesToCategoriesMap = {};
    this.filteredCategories = [];
    const categories = this.categoriesService.getStoredCategories();

    expenses.forEach((expense) => {
      const category = categories.find((cat) => cat.id === expense.category);
      if (category) {
        if (!this.expensesToCategoriesMap[expense.category]) {
          this.expensesToCategoriesMap[expense.category] = [];
        }
        this.expensesToCategoriesMap[expense.category].push(expense);
      }
    });

    this.filteredCategories = categories.filter(
      (category) => this.expensesToCategoriesMap[category.id]?.length > 0
    );
  }

  filterExpenses(): void {
    this.filteredExpenses = this.expenses.filter(
      (expense) =>
        (!this.selectedEvent || expense.eventId === this.selectedEvent) &&
        (!this.selectedBudget || expense.budgetId === this.selectedBudget) &&
        (!this.selectedCategory || expense.category === this.selectedCategory)
    );

    this.mapExpensesToCategories(this.filteredExpenses);
  }
}
