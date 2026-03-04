import { TestBed } from '@angular/core/testing';

import { ZoneMapService } from './zone-map.service';

describe('ZoneMapService', () => {
  let service: ZoneMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
