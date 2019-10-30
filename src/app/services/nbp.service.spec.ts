import { TestBed } from '@angular/core/testing';

import { NBPService } from './nbp.service';

describe('NBPService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NBPService = TestBed.get(NBPService);
    expect(service).toBeTruthy();
  });
});
