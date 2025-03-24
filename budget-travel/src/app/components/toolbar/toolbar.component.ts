import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  imports: [MaterialModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  constructor(private readonly router: Router) {}

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
