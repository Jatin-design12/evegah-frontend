import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMapBikeModalComponent } from './dashboard-map-bike-modal.component';

describe('DashboardMapBikeModalComponent', () => {
  let component: DashboardMapBikeModalComponent;
  let fixture: ComponentFixture<DashboardMapBikeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardMapBikeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMapBikeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
