import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, of } from 'rxjs';
import { Currency } from '../../models/currency.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly _currencies = new BehaviorSubject<Currency[]>([]);
  public currencies$ = this._currencies.asObservable();

  private readonly _defaultCurrency = new BehaviorSubject<Currency>({
    code: 'NZD',
    symbol: 'NZ$',
  });
  public defaultCurrency$ = this._defaultCurrency.asObservable();

  setCurrencies(currencies: Currency[]) {
    this._currencies.next(currencies);
  }

  getCurrencies(): Observable<Currency[]> {
    return this.currencies$.pipe(
      switchMap((currencies) => {
        if (currencies.length === 0) {
          const allCurrencies = this.getSupportedCurrencies();
          this._currencies.next(allCurrencies);
          return of(allCurrencies);
        }
        return of(currencies);
      })
    );
  }

  getSupportedCurrencies(): Currency[] {
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
