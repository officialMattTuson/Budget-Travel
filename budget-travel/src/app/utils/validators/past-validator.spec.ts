import { FormControl, ValidatorFn } from '@angular/forms';
import moment from 'moment';
import { pastDateValidator } from './past-date-validator';

describe('Past Date Validator', () => {
  let validatorFn: ValidatorFn;
  const dateYesterday = moment().subtract(1, 'day').toISOString();
  const dateToday = moment().toISOString();
  const dateTomorrow = moment().add(1, 'day').toISOString();

  beforeEach(() => {
    validatorFn = pastDateValidator();
  });

  it('should return ValidationError if the input date is in the future', () => {
    const control = new FormControl(dateTomorrow);
    const result = validatorFn(control);
    expect(result).toEqual({ pastDate: true });
  });

  it('should return null if an input date is not provided', () => {
    const control = new FormControl();
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should return null if the input date is in the past', () => {
    const control = new FormControl(dateYesterday);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it("should return null if the input date is today's date", () => {
    const control = new FormControl(dateToday);
    const result = validatorFn(control);
    expect(result).toBeNull();
  });
});
