import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';
import { OverlayService } from '../../services/overlay.service';
import { AddBudgetComponent } from '../../components/overlays/add-budget/add-budget.component';

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
    console.log("Opening Add Budget Form...");
    
    const componentRef = this.overlayService.open(AddBudgetComponent);

    if (componentRef) {
      componentRef.instance.result.subscribe((result: string) => {
        console.log(`Budget form result: ${result}`);

        if (result === 'submitted' || result === 'updated') {
          this.loadBudgets();
        }
      });
    }
  }
}
