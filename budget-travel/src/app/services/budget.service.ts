import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Budget } from '../models/budgets.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private readonly apiUrl = `${environment.apiUrl}/budget`;

  constructor(private readonly http: HttpClient) {}

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}`);
  }

  setBudget(budgetData: Budget): Observable<Budget> {
    return this.http.post<Budget>(`${this.apiUrl}`, budgetData);
  }

  getBudgetAlerts(): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/alerts`);
  }

  deleteBudget(): Observable<Budget> {
    return this.http.delete<Budget>(`${this.apiUrl}`);
  }

  getBudgetById(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/${id}`);
  }

}
