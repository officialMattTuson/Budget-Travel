import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';
import { Budget } from '../../models/budgets.model';
import { CardDetailsComponent } from '../../components/card-details/card-details.component';
import { Expense } from '../../models/expense.model';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BudgetFacadeService } from '../../services/budgets/budget-facade.service';
import { Observable } from 'rxjs';
import { AlertService } from '../../services/shared/alert.service';

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
  isLoading$!: Observable<boolean>;
  selectedBudgetExpenses: Expense[] = [];

  constructor(
    private readonly budgetFacadeService: BudgetFacadeService,
    private readonly alertService: AlertService,
    private readonly router: Router
  ) {
    this.isLoading$ = this.budgetFacadeService.isLoading$;
  }

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
        this.budgetFacadeService.setIsLoading(false);
      },
      error: (error) => {
        this.alertService.error('Error fetching busgets: ' + error);
        this.budgetFacadeService.setIsLoading(false);
      },
    });
  }

  resetBudgets() {
    this.activeBudgets = [];
    this.inactiveBudgets = [];
  }

  openAddBudgetForm() {
    this.budgetFacadeService.openBudgetForm();
  }

  onTabChange(index: number): void {
    const selectedBudget = this.activeBudgets[index];
    this.selectedBudgetExpenses = selectedBudget.expenses || [];
  }

  viewBudgetDetails(budgetId: string) {
    this.router.navigateByUrl(`/budgets/${budgetId}`);
  }
}
