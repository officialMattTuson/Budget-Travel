import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  title = 'Travel Smart';

  menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dataset',
      route: '/dashboard',
    },
    { id: 'trips', label: 'My Trips', icon: 'flight', route: '/trips' },
    { id: 'expenses', label: 'Expenses', icon: 'payments', route: '/expenses' },
    { id: 'budget', label: 'Budget', icon: 'savings', route: '/budgets' },
    { id: 'explore', label: 'Explore', icon: 'explore', route: '/explore' },
    { id: 'settings', label: 'Settings', icon: 'settings', route: '/settings' },
  ];
}
