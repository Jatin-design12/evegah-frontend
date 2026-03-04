import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarePlanMasterComponent } from './fare-plan-master.component';

describe('FarePlanMasterComponent', () => {
  let component: FarePlanMasterComponent;
  let fixture: ComponentFixture<FarePlanMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarePlanMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarePlanMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
