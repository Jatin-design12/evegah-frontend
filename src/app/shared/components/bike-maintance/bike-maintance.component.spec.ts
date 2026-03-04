import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeMaintanceComponent } from './bike-maintance.component';

describe('BikeMaintanceComponent', () => {
  let component: BikeMaintanceComponent;
  let fixture: ComponentFixture<BikeMaintanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BikeMaintanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BikeMaintanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
