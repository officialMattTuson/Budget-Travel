import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Budget, BudgetPostRequest } from '../../models/budgets.model';
import { OverlayResult, OverlayType } from '../../models/overlay-result.model';
import { AddBudgetComponent } from '../../components/overlays/add-budget/add-budget.component';
import { OverlayService } from '../shared/overlay.service';
import { BudgetService } from './budget.service';
import { AlertService } from '../shared/alert.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetFacadeService {
  private readonly _budgets = new BehaviorSubject<Budget[]>([]);
  public budgets$ = this._budgets.asObservable();

  private readonly _isLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading.asObservable();

  constructor(
    private readonly overlayService: OverlayService,
    private readonly budgetService: BudgetService,
    private readonly alertService: AlertService
  ) {}

  getBudgets(): Observable<Budget[]> {
    if (this._budgets.getValue().length === 0) {
      return this.fetchBudgets();
    }
    return of(this._budgets.getValue());
  }

  fetchBudgets(): Observable<Budget[]> {
    return this.budgetService.getBudgets();
  }

  setBudgets(budgets: Budget[]) {
    this._budgets.next(budgets);
  }

  setIsLoading(isLoading: boolean) {
    this._isLoading.next(isLoading);
  }

  openBudgetForm(budget?: Budget) {
    const componentRef = this.overlayService.open(
      AddBudgetComponent,
      budget,
      OverlayType.Budget
    );

    if (componentRef) {
      componentRef.instance.result.subscribe((result: OverlayResult) => {
        if (!result.data) {
          return;
        }
        if (result.status === 'submitted') {
          return this.addNewBudget(result.data as BudgetPostRequest);
        }

        if (result.status === 'updated' && budget) {
          return this.updateBudget(result.data as BudgetPostRequest, budget);
        }
      });
    }
  }

  addNewBudget(formData: BudgetPostRequest) {
    const budgetPostObject = this.mapBudgetToPostRequest(formData);
    this.budgetService.addBudget(budgetPostObject).subscribe({
      next: (newBudget: Budget) => {
        const budgets = this._budgets.getValue();
        budgets.push(newBudget);
        this.setBudgets(budgets);
      },
      error: (error) =>
        this.alertService.error('Error adding budgets: ' + error),
    });
  }

  mapBudgetToPostRequest(budgetData: BudgetPostRequest): Partial<Budget> {
    let budgetPostObject: Partial<Budget> = {
      name: budgetData.name,
      amount: budgetData.amount,
      currency: budgetData.currency,
      startDate: budgetData.startDate.toLocaleDateString(),
      endDate: budgetData.endDate.toLocaleDateString(),
    };
    return budgetPostObject;
  }

  updateBudget(formData: BudgetPostRequest, budget: Budget) {
    const budgetPostObject = this.mapBudgetToPostRequest(formData);
    this.budgetService.updateBudget(budgetPostObject, budget._id).subscribe({
      next: (addedBudget: Budget) => {
        const currentBudgets = this._budgets.getValue();
        const index = currentBudgets.findIndex((b) => b._id === budget._id);
        addedBudget.totalSpent = budget.totalSpent;
        currentBudgets[index] = addedBudget;

        this.setBudgets(currentBudgets);
      },
      error: (error) =>
        this.alertService.error('Error updating budgets: ' + error),
    });
  }
}
