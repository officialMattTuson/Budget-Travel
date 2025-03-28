import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { Expense } from '../../models/expense.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryMapperPipe } from '../../pipes/category-mapper.pipe';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-view-budget',
  imports: [
    CommonModule,
    MaterialModule,
    CardDetailsComponent,
    HeaderComponent,
    CategoryMapperPipe,
  ],
  templateUrl: './view-budget.component.html',
  styleUrl: './view-budget.component.scss',
})
export class ViewBudgetComponent implements OnInit, AfterViewInit {
  budget!: Budget;

  displayedColumns: string[] = [
    'description',
    'date',
    'amount',
    'currency',
    'category',
  ];
  dataSource!: MatTableDataSource<Expense>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly budgetService: BudgetService,
    private readonly overlayService: OverlayService,
    private readonly dataCache: DataCacheService,
    private readonly categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.getBudgetById(id);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getBudgetById(id: string) {
    this.budgetService
      .getBudgetById(id)
      .pipe(take(1))
      .subscribe({
        next: (budget) => {
          this.budget = budget;
          this.dataSource = new MatTableDataSource(this.budget.expenses);
          this.setFilters();
        },
        error: (error) => console.error('Error fetching budget:', error),
      });
  }

  setFilters() {
    this.dataSource.filterPredicate = (
      data: Expense,
      filter: string
    ): boolean => {
      const categories = this.categoriesService.getStoredCategories();
      const categoryName =
        categories.find((cat) => cat.id === data.category)?.name ?? '';

      const searchStr = [
        data.amount,
        data.currency,
        data.description,
        data.recurrenceInterval,
        categoryName,
        data.recurring ? 'yes' : 'no',
        new Date(data.date).toLocaleDateString(),
      ]
        .join(' ')
        .toLowerCase();

      return searchStr.includes(filter.trim().toLowerCase());
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    this.budgetService
      .updateBudget(budgetPostObject, this.budget._id)
      .subscribe({
        next: (addedBudget: Budget) => {
          const currentBudgets = this.dataCache.getBudgets();
          const index = currentBudgets.findIndex(
            (b) => b._id === this.budget._id
          );
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
