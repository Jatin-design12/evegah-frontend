import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikedetailsComponent } from './bikedetails.component';

describe('BikedetailsComponent', () => {
  let component: BikedetailsComponent;
  let fixture: ComponentFixture<BikedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BikedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BikedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
