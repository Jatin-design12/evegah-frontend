import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocateButtonModalComponent } from './locate-button-modal.component';

describe('LocateButtonModalComponent', () => {
  let component: LocateButtonModalComponent;
  let fixture: ComponentFixture<LocateButtonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocateButtonModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocateButtonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
