import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Expense, ExpensePostRequest } from '../../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private readonly apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private readonly http: HttpClient) {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}`);
  }

  getExpenseById(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  addExpense(expense: ExpensePostRequest): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}`, expense);
  }

  updateExpense(id: string, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expense);
  }

  deleteExpense(id: string): Observable<Expense> {
    return this.http.delete<Expense>(`${this.apiUrl}/${id}`);
  }
}
