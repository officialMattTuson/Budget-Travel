import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budgets/budget.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';
import { OverlayService } from '../../services/shared/overlay.service';
import { AddBudgetComponent } from '../../components/overlays/add-budget/add-budget.component';
import { OverlayResult } from '../../models/overlay-result.model';
import { Budget, BudgetPostRequest } from '../../models/budgets.model';
import { CardDetailsComponent } from '../../components/card-details/card-details.component';
import { Expense } from '../../models/expense.model';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BudgetFacadeService } from '../../services/budgets/budget-facade.service';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
  imports: [
    CommonModule,
    MaterialModule,
    CardDetailsComponent,
    HeaderComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BudgetsComponent implements OnInit {
  budgets: Budget[] = [];
  activeBudgets: Budget[] = [];
  inactiveBudgets: Budget[] = [];
  isLoading = false;
  selectedBudgetExpenses: Expense[] = [];

  constructor(
    private readonly budgetService: BudgetService,
    private readonly budgetFacadeService: BudgetFacadeService,
    private readonly overlayService: OverlayService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.observeBudgetChanges();
  }

  observeBudgetChanges() {
    this.budgetFacadeService.budgets$.subscribe({
      next: (budgets) => {
        this.resetBudgets();
        if (budgets.length === 0) {
          this.router.navigate(['/dashboard']);
        }
        this.budgets = budgets;
        budgets.forEach((budget) => {
          if (budget.isActive) {
            this.activeBudgets.push(budget);
          } else {
            this.inactiveBudgets.push(budget);
          }
        });
        this.selectedBudgetExpenses = this.activeBudgets[0].expenses || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching budgets:', error);
        this.isLoading = false;
      },
    });
  }

  // setActiveBudget(budgetId: string) {
  //   this.budgetService.setActiveBudget(budgetId).subscribe(() => {
  //     this.activeBudget = this.budgets.find((b) => b._id === budgetId) || null;
  //   });
  // }

  resetBudgets() {
    this.activeBudgets = [];
    this.inactiveBudgets = [];
  }

  openAddBudgetForm() {
    const componentRef = this.overlayService.open(AddBudgetComponent);

    if (componentRef) {
      componentRef.instance.result.subscribe((result: OverlayResult) => {
        if (!result.data) {
          return;
        }
        if (result.status === 'submitted') {
          this.addNewBudget(result.data as BudgetPostRequest);
        }
      });
    }
  }

  addNewBudget(formData: BudgetPostRequest) {
    const budgetPostObject = this.mapBudgetToPostRequest(formData);
    this.budgetService.addBudget(budgetPostObject).subscribe({
      next: (budget: Budget) => {
        this.isLoading = true;
        this.budgets.push(budget);
        this.budgetFacadeService.setBudgets(this.budgets);
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

  onTabChange(index: number): void {
    const selectedBudget = this.activeBudgets[index];
    this.selectedBudgetExpenses = selectedBudget.expenses || [];
  }

  viewBudgetDetails(budgetId: string) {
    this.router.navigateByUrl(`/budgets/${budgetId}`);
  }
}
