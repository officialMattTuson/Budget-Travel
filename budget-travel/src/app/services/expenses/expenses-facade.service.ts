import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Expense, ExpensePostRequest } from '../../models/expense.model';
import { OverlayService } from '../shared/overlay.service';
import { OverlayResult } from '../../models/overlay-result.model';
import { ExpensesService } from './expenses.service';

@Injectable({
  providedIn: 'root',
})
export class ExpensesFacadeService {
  private readonly _expenses = new BehaviorSubject<Expense[]>([]);
  public expenses$ = this._expenses.asObservable();

  constructor(
    private readonly overlayService: OverlayService,
    private readonly expensesService: ExpensesService
  ) {}

  getExpenses(): Expense[] {
    return this._expenses.getValue();
  }

  setExpenses(expenses: Expense[]) {
    this._expenses.next(expenses);
  }

  // openAddExpenseForm() {
  //   const componentRef = this.overlayService.open(AddExpenseComponent);

  //   if (componentRef) {
  //     componentRef.instance.result.subscribe((result: OverlayResult) => {
  //       if (!result.data) {
  //         return;
  //       }
  //       if (result.status === 'submitted') {
  //         this.addNewExpense(result.data as ExpensePostRequest);
  //       }
  //     });
  //   }
  // }

  addNewExpense(expense: ExpensePostRequest): void {
    this.expensesService.addExpense(expense).subscribe({
      next: (newExpense: Expense) => {
        const expenses = this.getExpenses();
        expenses.push(newExpense);
        this.setExpenses(expenses);
      },
      error: (error) => console.error(error),
    });
  }
}
