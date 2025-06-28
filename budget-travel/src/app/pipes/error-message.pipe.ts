import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'errorMessage',
  pure: false
})
export class ErrorMessagePipe implements PipeTransform {
  transform(
    formControl: AbstractControl | null,
    formDisplayName: string
  ): string | null {
    if (!formControl) {
      return null;
    }
    switch (true) {
      case formControl.hasError('required'):
        return `${formDisplayName} is required`;
      case formControl.hasError('endDatePast'):
        return `${formDisplayName} cannot be in the past`;
      case formControl.hasError('endBeforeStart'):
        return `${formDisplayName} cannot be before start date`;
      case formControl.hasError('minlength'):
        return `This field requires more than ${formControl.errors?.['minlength'].requiredLength} characters (currently ${formControl.errors?.['minlength'].actualLength}).`;
      case formControl.hasError('maxlength'):
        return `This field requires more than ${formControl.errors?.['maxlength'].requiredLength} characters (currently ${formControl.errors?.['maxlength'].actualLength}).`;
      default:
        return null;
    }
  }
}
