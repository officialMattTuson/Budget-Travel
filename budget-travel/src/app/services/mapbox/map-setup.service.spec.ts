import { TestBed } from '@angular/core/testing';

import { MapSetupService } from './map-setup.service';

describe('MapSetupService', () => {
  let service: MapSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
