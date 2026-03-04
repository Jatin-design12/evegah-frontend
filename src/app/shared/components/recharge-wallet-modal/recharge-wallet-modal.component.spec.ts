import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeWalletModalComponent } from './recharge-wallet-modal.component';

describe('RechargeWalletModalComponent', () => {
  let component: RechargeWalletModalComponent;
  let fixture: ComponentFixture<RechargeWalletModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechargeWalletModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeWalletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
