import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BudgetService } from '../services/budget.service';
import { EventService } from '../services/event.service';
import { Budget } from '../models/budgets.model';
import { Expense } from '../models/expense.model';
import { Event } from '../models/event.model';
import { ExpensesService } from './expenses.service';

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

  private readonly _currencies = new BehaviorSubject<
    { code: string; symbol: string }[]
  >([]);
  public currencies$ = this._currencies.asObservable();

  private readonly _defaultCurrency = new BehaviorSubject<{
    code: string;
    symbol: string;
  }>({ code: 'NZD', symbol: 'NZ$' });
  public defaultCurrency$ = this._defaultCurrency.asObservable();

  constructor(
    private readonly budgetService: BudgetService,
    private readonly expenseService: ExpensesService,
    private readonly eventService: EventService
  ) {}

  getBudgets(): Observable<Budget[]> {
    return this.budgets$.pipe(
      switchMap((budgets) => {
        if (budgets.length === 0) {
          return this.budgetService
            .getBudgets()
            .pipe(tap((fetchedBudgets) => this._budgets.next(fetchedBudgets)));
        }
        return of(budgets);
      })
    );
  }

  getExpenses(): Observable<Expense[]> {
    return this.expenses$.pipe(
      switchMap((expenses) => {
        if (expenses.length === 0) {
          return this.expenseService
            .getExpenses()
            .pipe(
              tap((fetchedExpenses) => this._expenses.next(fetchedExpenses))
            );
        }
        return of(expenses);
      })
    );
  }

  getEvents(): Observable<Event[]> {
    return this.events$.pipe(
      switchMap((events) => {
        if (events.length === 0) {
          return this.eventService
            .getEvents()
            .pipe(tap((fetchedEvents) => this._events.next(fetchedEvents)));
        }
        return of(events);
      })
    );
  }

  refreshBudgets() {
    this.budgetService.getBudgets().subscribe((budgets) => {
      this._budgets.next(budgets);
    });
  }

  refreshExpenses() {
    this.expenseService.getExpenses().subscribe((expenses) => {
      this._expenses.next(expenses);
    });
  }

  refreshEvents() {
    this.eventService.getEvents().subscribe((events) => {
      this._events.next(events);
    });
  }

  setCurrencies(currencies: { code: string; symbol: string }[]) {
    this._currencies.next(currencies);
  }

  getCurrencies(): Observable<{ code: string; symbol: string }[]> {
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

  getAllCurrencies(): { code: string; symbol: string }[] {
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

  setDefaultCurrency(currency: { code: string; symbol: string }) {
    this._defaultCurrency.next(currency);
  }

  getDefaultCurrency(): { code: string; symbol: string } {
    return this._defaultCurrency.getValue();
  }
}
