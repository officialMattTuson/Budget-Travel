import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {
  decimalRegex,
  maxNameLength,
  minDescriptionLength,
} from '../../../utils/validators/validation-consts';
import { Category } from '../../../models/category.model';
import { endDateControlValidator } from '../../../utils/validators/past-date-validator';

const getTripForm = () => {
  const fb = new FormBuilder();
  return fb.group({
    name: fb.control('', [
      Validators.required,
      Validators.minLength(minDescriptionLength),
      Validators.maxLength(maxNameLength),
    ]),
    destination: fb.control('', [
      Validators.required,
      Validators.minLength(minDescriptionLength),
      Validators.maxLength(maxNameLength),
    ]),
    startDate: fb.control('', [Validators.required]),
    endDate: fb.control('', [
      Validators.required,
      endDateControlValidator('startDate'),
    ]),
    currency: fb.control('', Validators.required),
    totalBudget: fb.control('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern(decimalRegex),
    ]),
    categoryBreakdown: fb.array([]),
  });
};

export class TripForm extends FormGroup {
  constructor() {
    super(getTripForm().controls, getTripForm().validator);
  }

  get categoryBreakdown(): FormArray {
    return this.get('categoryBreakdown') as FormArray;
  }

  addCategoryBreakdown(categories: Category[]): void {
    this.categoryBreakdown.clear();
    categories.forEach((cat) => {
      this.categoryBreakdown.push(
        new FormGroup({
          categoryId: new FormBuilder().control(cat.id),
          amount: new FormBuilder().control(0, [
            Validators.required,
            Validators.min(0),
          ]),
        })
      );
    });
  }
}
