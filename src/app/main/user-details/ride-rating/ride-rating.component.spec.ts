import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideRatingComponent } from './ride-rating.component';

describe('RideRatingComponent', () => {
  let component: RideRatingComponent;
  let fixture: ComponentFixture<RideRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RideRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RideRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
