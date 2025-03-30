import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Expense } from '../../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpensesFacadeService {
  private readonly _expenses = new BehaviorSubject<Expense[]>([]);
  public expenses$ = this._expenses.asObservable();

  getExpenses(): Expense[] {
    return this._expenses.getValue();
  }

  setExpenses(expenses: Expense[]) {
    this._expenses.next(expenses);
  }
}
