import { TestBed } from '@angular/core/testing';

import { NBPCurrenciesService } from './nbp-currencies.service';

describe('NBPCurrenciesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NBPCurrenciesService = TestBed.get(NBPCurrenciesService);
    expect(service).toBeTruthy();
  });
});
