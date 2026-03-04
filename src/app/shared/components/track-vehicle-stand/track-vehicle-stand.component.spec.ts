import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackVehicleStandComponent } from './track-vehicle-stand.component';

describe('TrackVehicleStandComponent', () => {
  let component: TrackVehicleStandComponent;
  let fixture: ComponentFixture<TrackVehicleStandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackVehicleStandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackVehicleStandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
