import { TestBed } from '@angular/core/testing';

import { BudgetFacadeService } from './budget-facade.service';

describe('BudgetFacadeService', () => {
  let service: BudgetFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
