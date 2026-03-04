import { TestBed } from '@angular/core/testing';

import { FarePlanService } from './fare-plan.service';

describe('FarePlanService', () => {
  let service: FarePlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FarePlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
