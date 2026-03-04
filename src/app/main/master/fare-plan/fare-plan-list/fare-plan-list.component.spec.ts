import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarePlanListComponent } from './fare-plan-list.component';

describe('FarePlanListComponent', () => {
  let component: FarePlanListComponent;
  let fixture: ComponentFixture<FarePlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarePlanListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarePlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
