import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrModelComponent } from './qr-model.component';

describe('QrModelComponent', () => {
  let component: QrModelComponent;
  let fixture: ComponentFixture<QrModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
