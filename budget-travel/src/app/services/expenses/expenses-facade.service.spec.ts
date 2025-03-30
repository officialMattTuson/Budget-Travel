import { TestBed } from '@angular/core/testing';

import { ExpensesFacadeService } from './expenses-facade.service';

describe('ExpensesFacadeService', () => {
  let service: ExpensesFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpensesFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
