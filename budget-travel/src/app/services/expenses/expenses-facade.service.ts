import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, tap } from 'rxjs';
import { Expense, ExpensePostRequest } from '../../models/expense.model';
import { OverlayService } from '../shared/overlay.service';
import { ExpensesService } from './expenses.service';
import { AlertService } from '../shared/alert.service';

@Injectable({
  providedIn: 'root',
})
export class ExpensesFacadeService {
  private readonly _expenses = new BehaviorSubject<Expense[]>([]);
  public expenses$ = this._expenses.asObservable();

  constructor(
    private readonly overlayService: OverlayService,
    private readonly alertService: AlertService,
    private readonly expensesService: ExpensesService
  ) {}

  getExpenses(): Expense[] {
    return this._expenses.getValue();
  }

  setExpenses(expenses: Expense[]) {
    this._expenses.next(expenses);
  }

  addNewExpense(expense: ExpensePostRequest): Observable<Expense> {
    return this.expensesService.addExpense(expense).pipe(
      catchError((error) => {
        this.alertService.error('Error adding expense: ' + error);
        return EMPTY;
      }),
      tap((newExpense: Expense) => {
        const expenses = this.getExpenses();
        expenses.push(newExpense);
        this.setExpenses(expenses);
      })
    );
  }
}
