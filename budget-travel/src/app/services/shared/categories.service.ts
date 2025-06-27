import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Category, CategoryColor } from '../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  constructor(private readonly http: HttpClient) {}

  private readonly _categories: BehaviorSubject<Category[]> =
    new BehaviorSubject<Category[]>([]);
  public categories$ = this._categories.asObservable();

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}`).pipe(
      map((categories) =>
        categories.map((cat) => ({
          ...cat,
          color: CategoryColor.getColorById(cat.id),
        }))
      )
    );
  }

  // Temporarily storing these methods here until facade is implemented
  setCategories(categories: Category[]): void {
    this._categories.next(categories);
  }

  getStoredCategories(): Category[] {
    return this._categories.getValue();
  }

  getCategoryNameById(id: number): string {
    return (
      this._categories.getValue().find((category) => category.id === id)
        ?.name ?? ''
    );
  }
}
