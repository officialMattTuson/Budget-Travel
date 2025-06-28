import { TestBed } from '@angular/core/testing';

import { TripFacadeService } from './trip-facade.service';

describe('TripFacadeService', () => {
  let service: TripFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
