import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayService } from '../../../../services/overlay.service';

@Component({
  selector: 'app-base-overlay',
  imports: [],
  templateUrl: './base-overlay.component.html',
  styleUrl: './base-overlay.component.scss'
})
export abstract class BaseOverlayComponent {
  @Output() result = new EventEmitter<string>();

  form: FormGroup = new FormGroup({});

  constructor(protected readonly fb: FormBuilder, protected readonly overlayService: OverlayService) {
    this.initializeForm();
  }

  protected abstract initializeForm(): void;

  protected submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.emitResult('submitted');
  }

  protected updateForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.emitResult('updated');
  }

  cancel(): void {
    this.emitResult('cancelled');
  }

  private emitResult(status: 'submitted' | 'updated' | 'cancelled'): void {
    this.result.emit(status);
    this.overlayService.close();
  }
}