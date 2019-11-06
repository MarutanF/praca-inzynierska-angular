import { TestBed } from '@angular/core/testing';

import { NBPPeriodService } from './nbp-period.service';

describe('NBPPeriodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NBPPeriodService = TestBed.get(NBPPeriodService);
    expect(service).toBeTruthy();
  });
});
