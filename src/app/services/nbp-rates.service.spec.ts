import { TestBed } from '@angular/core/testing';

import { NBPRatesService } from './nbp-rates.service';

describe('NBPRatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NBPRatesService = TestBed.get(NBPRatesService);
    expect(service).toBeTruthy();
  });
});
