import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimumWalletBalanceComponent } from './minimum-wallet-balance.component';

describe('MinimumWalletBalanceComponent', () => {
  let component: MinimumWalletBalanceComponent;
  let fixture: ComponentFixture<MinimumWalletBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinimumWalletBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimumWalletBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
