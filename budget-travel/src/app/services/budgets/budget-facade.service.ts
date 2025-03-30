import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Budget, BudgetPostRequest } from '../../models/budgets.model';
import { OverlayResult, OverlayType } from '../../models/overlay-result.model';
import { AddBudgetComponent } from '../../components/overlays/add-budget/add-budget.component';
import { OverlayService } from '../shared/overlay.service';
import { BudgetService } from './budget.service';

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
    private readonly budgetService: BudgetService
  ) {}

  getBudgets(): Budget[] {
    return this._budgets.getValue();
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
        const budgets = this.getBudgets();
        budgets.push(newBudget);
        this.setBudgets(budgets);
      },
      error: (error) => {
        console.error('Error adding new budget:', error);
      },
    });
  }

  mapBudgetToPostRequest(budgetData: BudgetPostRequest): Partial<Budget> {
    let budgetPostObject: Partial<Budget> = {
      name: budgetData.budgetName,
      amount: budgetData.budgetTarget,
      currency: budgetData.budgetCurrency,
      startDate: budgetData.budgetStartDate.toLocaleDateString(),
      endDate: budgetData.budgetEndDate.toLocaleDateString(),
    };
    return budgetPostObject;
  }

  updateBudget(formData: BudgetPostRequest, budget: Budget) {
    const budgetPostObject = this.mapBudgetToPostRequest(formData);
    this.budgetService
      .updateBudget(budgetPostObject, budget._id)
      .subscribe({
        next: (addedBudget: Budget) => {
          const currentBudgets = this.getBudgets();
          const index = currentBudgets.findIndex(
            (b) => b._id === budget._id
          );
          addedBudget.totalSpent = budget.totalSpent;
          currentBudgets[index] = addedBudget;

          this.setBudgets(currentBudgets);
        },
        error: (error) => {
          console.error('Error updating budget:', error);
        },
      });
  }
}
