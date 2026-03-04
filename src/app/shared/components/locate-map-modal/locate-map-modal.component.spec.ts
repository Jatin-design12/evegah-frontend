import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocateMapModalComponent } from './locate-map-modal.component';

describe('LocateMapModalComponent', () => {
  let component: LocateMapModalComponent;
  let fixture: ComponentFixture<LocateMapModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocateMapModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocateMapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
