import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Budget } from '../models/budgets.model';
import { Expense } from '../models/expense.model';
import { Event } from '../models/event.model';
@Injectable({
  providedIn: 'root',
})
export class DataCacheService {
  private readonly _budgets = new BehaviorSubject<Budget[]>([]);
  public budgets$ = this._budgets.asObservable();

  private readonly _expenses = new BehaviorSubject<Expense[]>([]);
  public expenses$ = this._expenses.asObservable();

  private readonly _events = new BehaviorSubject<Event[]>([]);
  public events$ = this._events.asObservable();

  getBudgets(): Budget[] {
    return this._budgets.getValue();
  }

  setBudgets(budgets: Budget[]) {
    this._budgets.next(budgets);
  }

  getExpenses(): Expense[] {
    return this._expenses.getValue();
  }

  setExpenses(expenses: Expense[]) {
    this._expenses.next(expenses);
  }
}
