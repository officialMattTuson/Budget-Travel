import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';
import { OverlayService } from '../../services/overlay.service';
import { AddBudgetComponent } from '../../components/overlays/add-budget/add-budget.component';
import { OverlayResult } from '../../models/overlay-result.model';
import { Budget, BudgetPostRequest } from '../../models/budgets.model';
import { DataCacheService } from '../../services/data-cache.service';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
  imports: [CommonModule, MaterialModule],
})
export class BudgetsComponent implements OnInit {
  budgets: Budget[] = [];
  selectedEvent: string = '';
  activeBudget: Budget | null = null;
  isLoading: boolean = true;

  constructor(
    private readonly budgetService: BudgetService,
    private readonly overlayService: OverlayService,
    private readonly dataCache: DataCacheService
  ) {}

  ngOnInit() {
    this.loadBudgets();
  }

  loadBudgets() {
    this.dataCache.getBudgets().subscribe({
      next: (data) => {
        this.budgets = data;
        console.log(data);
        this.activeBudget = this.budgets.find((b) => b.isActive) || null;
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

  addNewBudget(budgetData: BudgetPostRequest) {
    let budgetPostObject: Partial<Budget> = {
      name: budgetData.budgetName,
      amount: budgetData.budgetTarget,
      currency: budgetData.budgetCurrency,
      startDate: budgetData.budgetStartDate.toLocaleDateString(),
      endDate: budgetData.budgetEndDate.toLocaleDateString(),
    };

    this.budgetService.addBudget(budgetPostObject).subscribe({
      next: () => {
        this.dataCache.refreshBudgets();
      },
      error: (error) => {
        console.error('Error adding new budget:', error);
      },
    });
  }
}
