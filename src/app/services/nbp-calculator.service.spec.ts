import { TestBed } from '@angular/core/testing';

import { NBPCalculatorService } from './nbp-calculator.service';

describe('NBPCalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NBPCalculatorService = TestBed.get(NBPCalculatorService);
    expect(service).toBeTruthy();
  });
});
