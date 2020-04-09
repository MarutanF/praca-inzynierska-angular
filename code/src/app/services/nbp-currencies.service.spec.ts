import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NBPCurrenciesService } from './nbp-currencies.service';

describe('NBPCurrenciesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
  }));

  it('should be created', () => {
    const service: NBPCurrenciesService = TestBed.get(NBPCurrenciesService);
    expect(service).toBeTruthy();
  });
});
