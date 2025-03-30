import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Budget } from '../../models/budgets.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetFacadeService {
  private readonly _budgets = new BehaviorSubject<Budget[]>([]);
  public budgets$ = this._budgets.asObservable();

  getBudgets(): Budget[] {
    return this._budgets.getValue();
  }

  setBudgets(budgets: Budget[]) {
    this._budgets.next(budgets);
  }
}
