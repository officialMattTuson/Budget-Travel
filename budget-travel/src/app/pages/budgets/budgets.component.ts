import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';
import { OverlayService } from '../../services/overlay.service';
import { AddBudgetComponent } from '../../components/overlays/add-budget/add-budget.component';
import { OverlayResult } from '../../models/overlay-result.model';
import { Budget } from '../../models/budgets.model';

interface BudgetData {
  budgetName: string;
  budgetTarget: number;
  budgetCurrency: string;
  budgetStartDate: Date;
  budgetEndDate: Date;
}
@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
  imports: [CommonModule, MaterialModule],
})
export class BudgetsComponent implements OnInit {
  budgets: any[] = [];
  selectedEvent: string = '';
  activeBudget: any = null;
  isLoading: boolean = true;

  constructor(
    private readonly budgetService: BudgetService,
    private readonly overlayService: OverlayService
  ) {}

  ngOnInit() {
    this.loadBudgets();
  }

  loadBudgets() {
    this.budgetService
      .getBudgets()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.budgets = data;
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
    console.log('Opening Add Budget Form...');

    const componentRef = this.overlayService.open(AddBudgetComponent);

    if (componentRef) {
      componentRef.instance.result.subscribe((result: OverlayResult) => {
        if (!result.data) {
          return;
        }
        if (result.status === 'submitted') {
          this.addNewBudget(result.data as BudgetData);
        }
      });
    }
  }

  addNewBudget(budgetData: BudgetData) {
    let budgetPostObject: Budget = {
      name: budgetData.budgetName,
      amount: budgetData.budgetTarget,
      currency: budgetData.budgetCurrency,
      startDate: budgetData.budgetStartDate,
      endDate: budgetData.budgetEndDate
    };

    this.budgetService.addBudget(budgetPostObject).subscribe({
      next: () => {
        this.loadBudgets();
      },
      error: (error) => {
        console.error('Error adding new budget:', error);
      },
    });
  }
}
