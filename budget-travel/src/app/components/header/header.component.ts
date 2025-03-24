import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-header',
  imports: [MaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() header = '';
  @Input() buttonText = '';
  @Output() onAddButtonClicked = new EventEmitter<void>();

  onAddButtonClick(): void {
    this.onAddButtonClicked.emit();
  }
}
