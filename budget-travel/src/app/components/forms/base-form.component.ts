import { Directive, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PopupService } from '../../services/shared/popup.service';

@Directive()
export abstract class BaseFormComponent {
  constructor(protected readonly popupService: PopupService) {}

  form!: FormGroup;
  @Output() formSubmit = new EventEmitter<any>();

  abstract submit(): void;

  onCancel(): void {
    this.form.reset();
    this.formSubmit.emit(null);
    this.popupService.close();
  }
}
