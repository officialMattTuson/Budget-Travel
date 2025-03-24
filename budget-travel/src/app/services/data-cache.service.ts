import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Budget } from '../models/budgets.model';
import { Expense } from '../models/expense.model';
import { Event } from '../models/event.model';
import { Currency } from '../models/currency.model';

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

  private readonly _currencies = new BehaviorSubject<Currency[]>([]);
  public currencies$ = this._currencies.asObservable();

  private readonly _defaultCurrency = new BehaviorSubject<Currency>({
    code: 'NZD',
    symbol: 'NZ$',
  });
  public defaultCurrency$ = this._defaultCurrency.asObservable();

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

  setCurrencies(currencies: Currency[]) {
    this._currencies.next(currencies);
  }

  getCurrencies(): Observable<Currency[]> {
    return this.currencies$.pipe(
      switchMap((currencies) => {
        if (currencies.length === 0) {
          const allCurrencies = this.getAllCurrencies();
          this._currencies.next(allCurrencies);
          return of(allCurrencies);
        }
        return of(currencies);
      })
    );
  }

  getAllCurrencies(): Currency[] {
    const currencyCodes = Intl.supportedValuesOf('currency');

    return currencyCodes.map((code) => ({
      code,
      symbol: this.getCurrencySymbol(code, 'en'),
    }));
  }

  getCurrencySymbol(currencyCode: string, locale: string): string {
    try {
      const parts = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
      }).formatToParts();
      return (
        parts.find((part) => part.type === 'currency')?.value ?? currencyCode
      );
    } catch (error) {
      return currencyCode;
    }
  }

  setDefaultCurrency(currency: Currency) {
    this._defaultCurrency.next(currency);
  }

  getDefaultCurrency(): Currency {
    return this._defaultCurrency.getValue();
  }
}
