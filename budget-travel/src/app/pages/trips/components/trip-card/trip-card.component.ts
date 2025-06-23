import { Component, Input, OnInit } from '@angular/core';
import { Trip } from '../../../../models/trip.model';
import { BudgetService } from '../../../../services/budgets/budget.service';
import { Budget } from '../../../../models/budgets.model';
import { AlertService } from '../../../../services/shared/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../../../modules/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-card',
  imports: [MaterialModule, CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.scss',
})
export class TripCardComponent implements OnInit {
  @Input() trip!: Trip;

  budget: Budget | null = null;

  constructor(
    private readonly budgetService: BudgetService,
    private readonly alertService: AlertService
  ) {}

  ngOnInit(): void {
    const budgetId = this.trip.budgets[0];
    if (budgetId) {
      this.getBudgetById(budgetId);
    }
  }

  getBudgetById(budgetId: string): void {
    this.budgetService.getBudgetById(budgetId).subscribe({
      next: (budget) => {
        this.budget = budget;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.error(error.message);
      },
    });
  }
}
