import { TestBed } from '@angular/core/testing';

import { FirebaseAmountAlertsService } from './firebase-amount-alerts.service';

describe('FirebaseAmountAlertsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseAmountAlertsService = TestBed.get(FirebaseAmountAlertsService);
    expect(service).toBeTruthy();
  });
});
