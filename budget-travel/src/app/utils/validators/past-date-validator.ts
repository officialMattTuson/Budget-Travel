import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

export function endDateControlValidator(startDateField: string): ValidatorFn {
  return (endControl: AbstractControl): ValidationErrors | null => {
    if (!endControl.parent) return null;

    const start = endControl.parent.get(startDateField)?.value;
    const end = endControl.value;

    if (!end) return null;

    const endDate = moment(end).startOf('day');
    const today = moment().startOf('day');

    if (endDate.isBefore(today)) {
      return { endDatePast: true };
    }
    if (start) {
      const startDate = moment(start).startOf('day');
      if (endDate.isBefore(startDate)) {
        return { endBeforeStart: true };
      }
    }
    return null;
  };
}
