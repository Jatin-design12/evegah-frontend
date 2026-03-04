import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWithdrawModelComponent } from './add-withdraw-model.component';

describe('AddWithdrawModelComponent', () => {
  let component: AddWithdrawModelComponent;
  let fixture: ComponentFixture<AddWithdrawModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWithdrawModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWithdrawModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
