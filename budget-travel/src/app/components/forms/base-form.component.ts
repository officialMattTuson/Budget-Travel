import { Directive, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PopupService } from '../../services/shared/popup.service';

@Directive()
export abstract class BaseFormComponent {
  hasSubmitted = false;

  constructor(protected readonly popupService: PopupService) {}

  form!: FormGroup;
  @Output() formSubmit = new EventEmitter<any>();

  submit(): void {
    this.hasSubmitted = true;
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.popupService.close(this.form.value);
    }
  }

  onCancel(): void {
    this.form.reset();
    this.popupService.close(null);
  }

  allowOnlyDigits(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Home',
      'End',
    ];

    if (
      allowedKeys.includes(event.key) ||
      ((event.ctrlKey || event.metaKey) &&
        ['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase()))
    ) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
