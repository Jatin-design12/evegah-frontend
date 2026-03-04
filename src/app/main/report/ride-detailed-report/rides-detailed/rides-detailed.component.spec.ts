import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidesDetailedComponent } from './rides-detailed.component';

describe('RidesDetailedComponent', () => {
  let component: RidesDetailedComponent;
  let fixture: ComponentFixture<RidesDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RidesDetailedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RidesDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
