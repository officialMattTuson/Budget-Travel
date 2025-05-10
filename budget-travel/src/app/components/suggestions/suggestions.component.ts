import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-suggestions',
  imports: [MaterialModule],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.scss',
})
export class SuggestionsComponent {
  @Input() suggestion!: string;
  @Output() applySuggestion = new EventEmitter<void>();
  @Output() dismissSuggestion = new EventEmitter<void>();

  onApplySuggestion(): void {
    this.applySuggestion.emit();
  }

  onDismissSuggestion(): void {
    this.dismissSuggestion.emit();
  }
}
