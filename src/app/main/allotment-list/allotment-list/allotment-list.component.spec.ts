import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentListComponent } from './allotment-list.component';

describe('AllotmentListComponent', () => {
  let component: AllotmentListComponent;
  let fixture: ComponentFixture<AllotmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllotmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
