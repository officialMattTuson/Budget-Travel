import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ExpensesComponent } from './pages/expenses/expenses/expenses.component';
import { BudgetsComponent } from './pages/budgets/budgets.component';
import { ViewBudgetComponent } from './pages/view-budget/view-budget.component';
import { AddExpenseComponent } from './pages/expenses/add-expense/add-expense.component';
import { TripsComponent } from './pages/trips/trips.component';
import { ViewTripComponent } from './pages/view-trip/view-trip.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'budgets/:id', component: ViewBudgetComponent },
  { path: 'budgets/:id/expense/new', component: AddExpenseComponent },
  { path: 'expenses/new', component: AddExpenseComponent },
  // { path: 'expenses/:id/edit', component: EditExpenseComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'trips/:id', component: ViewTripComponent },
  // { path: 'trips/:id', component: TripDetailsComponent },
  // { path: 'reports', component: ReportsComponent },
  // { path: 'reports/trip/:id', component: TripReportComponent },
  // { path: 'reports/categories', component: CategoryReportComponent },
  // { path: 'currency', component: CurrencyComponent },
  // { path: 'currency/convert', component: CurrencyConverterComponent },
  // { path: 'settings', component: SettingsComponent },
  // { path: 'offline-expenses', component: OfflineExpensesComponent },
  // { path: '**', component: NotFoundComponent }
];
