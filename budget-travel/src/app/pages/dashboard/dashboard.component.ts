import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, MaterialModule],
})
export class DashboardComponent {

  constructor(private readonly router: Router) { }
  trips: any[] = [{ name: 'Paris', spent: 3200, currency: 'EUR' }, { name: 'London', spent: 1200, currency: 'GBP' }];
  budget = { total: 5000, spent: 3200 };
  recentExpenses: any[] = [];
  exchangeData = { from: 'USD', to: 'EUR', rate: 1 };
  categoryBreakdown: any[] = [];

  goToExpenses() {
    this.router.navigate(['/expenses']);
  }
}
