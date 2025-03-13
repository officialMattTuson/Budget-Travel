import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'expenses', component: ExpensesComponent },
  // { path: 'expenses/add', component: AddExpenseComponent },
  // { path: 'expenses/:id/edit', component: EditExpenseComponent },
  // { path: 'trips', component: TripsComponent },
  // { path: 'trips/add', component: AddTripComponent },
  // { path: 'trips/:id', component: TripDetailsComponent },
  // { path: 'budget', component: BudgetComponent },
  // { path: 'reports', component: ReportsComponent },
  // { path: 'reports/trip/:id', component: TripReportComponent },
  // { path: 'reports/categories', component: CategoryReportComponent },
  // { path: 'currency', component: CurrencyComponent },
  // { path: 'currency/convert', component: CurrencyConverterComponent },
  // { path: 'settings', component: SettingsComponent },
  // { path: 'offline-expenses', component: OfflineExpensesComponent },
  // { path: '**', component: NotFoundComponent }
];
