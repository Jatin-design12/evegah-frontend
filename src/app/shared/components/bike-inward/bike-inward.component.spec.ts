import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeInwardComponent } from './bike-inward.component';

describe('BikeInwardComponent', () => {
  let component: BikeInwardComponent;
  let fixture: ComponentFixture<BikeInwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BikeInwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BikeInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
