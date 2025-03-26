import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Budget } from '../models/budgets.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private readonly apiUrl = `${environment.apiUrl}/budgets`;

  constructor(private readonly http: HttpClient) {}

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl).pipe(
      map((budgets) =>
        budgets.map((budget) => ({
          ...budget,
          isActive: this.checkIfActive(
            budget.startDate,
            budget.endDate
          ),
        }))
      )
    );
  }

  private checkIfActive(startDate: string, endDate: string): boolean {
    const today = new Date();
    return today >= new Date(startDate) && today <= new Date(endDate);
  }

  addBudget(budgetData: Partial<Budget>): Observable<Budget> {
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

  getActiveBudget(): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/active`);
  }

  setActiveBudget(budgetId: string): Observable<Budget> {
    return this.http.post<Budget>(`${this.apiUrl}/set-active/${budgetId}`, {});
  }

  updateBudget(budgetData: Partial<Budget>, budgetId: string): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${budgetId}`, budgetData);
  }
}
