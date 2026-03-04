import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTansactionDetailComponent } from './user-tansaction-detail.component';

describe('UserTansactionDetailComponent', () => {
  let component: UserTansactionDetailComponent;
  let fixture: ComponentFixture<UserTansactionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTansactionDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTansactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
