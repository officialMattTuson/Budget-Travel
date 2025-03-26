import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardDetailsComponent } from '../../components/card-details/card-details.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MaterialModule } from '../../modules/material.module';
import { ActivatedRoute } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { take } from 'rxjs';
import { Budget, BudgetPostRequest } from '../../models/budgets.model';
import { OverlayService } from '../../services/overlay.service';
import { OverlayResult, OverlayType } from '../../models/overlay-result.model';
import { AddBudgetComponent } from '../../components/overlays/add-budget/add-budget.component';
import { mapBudgetToPostRequest } from '../../utils/mappers/budget-post-request-mapper';
import { DataCacheService } from '../../services/data-cache.service';

@Component({
  selector: 'app-view-budget',
  imports: [
    CommonModule,
    MaterialModule,
    CardDetailsComponent,
    HeaderComponent,
  ],
  templateUrl: './view-budget.component.html',
  styleUrl: './view-budget.component.scss',
})
export class ViewBudgetComponent implements OnInit {
  budget!: Budget;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly budgetService: BudgetService,
    private readonly overlayService: OverlayService,
    private readonly dataCache: DataCacheService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.budgetService
      .getBudgetById(id)
      .pipe(take(1))
      .subscribe({
        next: (budget) => {
          this.budget = budget;
        },
        error: (error) => console.error('Error fetching budget:', error),
      });
  }

  openViewBudgetForm() {
    const componentRef = this.overlayService.open(
      AddBudgetComponent,
      this.budget,
      OverlayType.Budget
    );

    if (componentRef) {
      componentRef.instance.result.subscribe((result: OverlayResult) => {
        if (!result.data) {
          return;
        }

        this.updateBudget(result.data as BudgetPostRequest);
      });
    }
  }

  updateBudget(formData: BudgetPostRequest) {
    const budgetPostObject = mapBudgetToPostRequest(formData);
    this.budgetService.updateBudget(budgetPostObject, this.budget._id).subscribe({
      next: (addedBudget: Budget) => {
        const currentBudgets = this.dataCache.getBudgets();
        const index = currentBudgets.findIndex((b) => b._id === this.budget._id);
        addedBudget.totalSpent = this.budget.totalSpent;
        currentBudgets[index] = addedBudget;

        this.dataCache.setBudgets(currentBudgets);
      },
      error: (error) => {
        console.error('Error updating budget:', error);
      },
    });
  }
}
