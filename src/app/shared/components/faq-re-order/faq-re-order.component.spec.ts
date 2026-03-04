import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqReOrderComponent } from './faq-re-order.component';

describe('FaqReOrderComponent', () => {
  let component: FaqReOrderComponent;
  let fixture: ComponentFixture<FaqReOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqReOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqReOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
