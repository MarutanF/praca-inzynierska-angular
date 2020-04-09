import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NBPRatesService } from './nbp-rates.service';

describe('NBPRatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
  }));

  it('should be created', () => {
    const service: NBPRatesService = TestBed.get(NBPRatesService);
    expect(service).toBeTruthy();
  });
});
