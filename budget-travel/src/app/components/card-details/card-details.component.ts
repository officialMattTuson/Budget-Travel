import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-card-details',
  imports: [CommonModule, MaterialModule],
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
})
export class CardDetailsComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() amount: number = 0;
  @Input() currency: string = 'NZD';
  @Input() startDate?: string | Date;
  @Input() endDate?: string | Date;
  @Input() progressValue?: number;
  @Input() isActive: boolean = false;
  @Input() spent?: number;
  @Input() remaining?: number;
  @Input() buttonText: string = 'View Details';
  @Input() variant: 'standard' | 'hero' = 'standard';
  @Output() onViewButtonClicked = new EventEmitter<void>();

  onViewButtonClick() {
    this.onViewButtonClicked.emit();
  }
}
