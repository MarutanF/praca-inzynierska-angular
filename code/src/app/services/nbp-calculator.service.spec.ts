import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NBPCalculatorService } from './nbp-calculator.service';

describe('NBPCalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
  }));

  it('should be created', () => {
    const service: NBPCalculatorService = TestBed.get(NBPCalculatorService);
    expect(service).toBeTruthy();
  });
});
