import { TestBed } from '@angular/core/testing';

import { CityMasterService } from './city-master.service';

describe('CityMasterService', () => {
  let service: CityMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
