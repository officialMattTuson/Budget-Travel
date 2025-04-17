import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pastDateValidator } from '../../../utils/validators/past-date-validator';
import {
  decimalRegex,
  maxDescriptionLength,
  maxNameLength,
  minDescriptionLength,
} from '../../../utils/validators/validation-consts';

const getExpenseForm = () => {
  const fb = new FormBuilder();
  return fb.group({
    currency: fb.control('', Validators.required),
    amount: fb.control('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern(decimalRegex),
    ]),
    date: fb.control('', [Validators.required, pastDateValidator()]),
    description: fb.control('', [
      Validators.required,
      Validators.minLength(minDescriptionLength),
      Validators.maxLength(maxNameLength),
    ]),
    location: fb.group({
      name: fb.control('', [
        Validators.required,
        Validators.minLength(minDescriptionLength),
        Validators.maxLength(maxNameLength),
      ]),
      address: fb.control('', [
        Validators.minLength(minDescriptionLength),
        Validators.maxLength(maxDescriptionLength),
      ]),
      city: fb.control(''),
      country: fb.control('', Validators.required),
      coordinates: fb.group({
        latitude: fb.control('', Validators.required),
        longitude: fb.control('', Validators.required),
      }),
    }),
    category: fb.control('', Validators.required),
    budgetId: fb.control('', Validators.required),
    eventId: fb.control(''),
  });
};

export class ExpenseForm extends FormGroup {
  constructor() {
    super(getExpenseForm().controls);
  }
}
