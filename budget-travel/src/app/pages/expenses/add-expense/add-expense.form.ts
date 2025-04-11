import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const getExpenseForm = () => {
  const fb = new FormBuilder();
  return fb.group({
    currency: fb.control('', Validators.required),
    amount: fb.control('', Validators.required),
    date: fb.control('', Validators.required),
    description: fb.control('', Validators.required),
    location: fb.group({
      name: fb.control('', Validators.required),
      address: fb.control(''),
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
