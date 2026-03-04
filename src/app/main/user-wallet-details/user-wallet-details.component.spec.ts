import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWalletDetailsComponent } from './user-wallet-details.component';

describe('UserWalletDetailsComponent', () => {
  let component: UserWalletDetailsComponent;
  let fixture: ComponentFixture<UserWalletDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWalletDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWalletDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
