import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../../services/expenses/expenses.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CategoriesService } from '../../services/shared/categories.service';
import { Category } from '../../models/category.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';
import { FormsModule } from '@angular/forms';
import { Event } from '../../models/event.model';
import { Expense, ExpensePostRequest } from '../../models/expense.model';
import { Budget } from '../../models/budgets.model';
import { CategoryMapperPipe } from '../../pipes/category-mapper.pipe';
import { OverlayService } from '../../services/shared/overlay.service';
import { OverlayResult } from '../../models/overlay-result.model';
import { AddExpenseComponent } from '../../components/overlays/add-expense/add-expense.component';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BudgetFacadeService } from '../../services/budgets/budget-facade.service';
import { ExpensesFacadeService } from '../../services/expenses/expenses-facade.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    MaterialModule,
    CommonModule,
    CategoryMapperPipe,
    HeaderComponent
  ],
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

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly expensesService: ExpensesService,
    private readonly categoriesService: CategoriesService,
    private readonly budgetFacadeService: BudgetFacadeService,
    private readonly expensesFacadeService: ExpensesFacadeService,
    private readonly overlayService: OverlayService,
    private readonly router: Router
  ) {
    this.categories$ = this.categoriesService.categories$;
  }

  ngOnInit(): void {
    this.observeBudgetChanges();
    this.observeExpenseChanges();
  }

  observeBudgetChanges(): void {
    this.budgetFacadeService.budgets$
      .pipe(takeUntil(this.destroy$))
      .subscribe((budgets) => {
        if (budgets.length === 0) {
          this.router.navigate(['/dashboard']);
        }
        this.budgets = budgets;
        this.filterExpenses();
      });
  }

  observeExpenseChanges(): void {
    this.expensesFacadeService.expenses$
      .pipe(takeUntil(this.destroy$))
      .subscribe((expenses) => {
        this.expenses = expenses;
        this.mapExpensesToCategories(this.expenses);
        this.filterExpenses();
      });
  }

  mapExpensesToCategories(expenses: Expense[]): void {
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

  openAddExpenseForm() {
    const componentRef = this.overlayService.open(AddExpenseComponent);

    if (componentRef) {
      componentRef.instance.result.subscribe((result: OverlayResult) => {
        if (!result.data) {
          return;
        }
        if (result.status === 'submitted') {
          this.addNewExpense(result.data as ExpensePostRequest);
        }
      });
    }
  }

  addNewExpense(expense: ExpensePostRequest): void {
    this.expensesService.addExpense(expense).subscribe({
      next: (expense: Expense) => {
        this.expenses.push(expense);
        this.expensesFacadeService.setExpenses(this.expenses);
      },
      error: (error) => console.error(error),
    });
  }
}
