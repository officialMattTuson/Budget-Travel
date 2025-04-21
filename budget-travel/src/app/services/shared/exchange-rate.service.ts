import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExchangeRateResult } from '../../models/exchange-rate-result';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  private readonly apiUrl = `${environment.apiUrl}/exchange`;

  constructor(private readonly http: HttpClient) {}

  convertCurrency(from: string, to: string, amount: number): Observable<ExchangeRateResult> {
    return this.http.get<ExchangeRateResult>(`${this.apiUrl}/convert/${from}/${to}/${amount}`);
  }
}
