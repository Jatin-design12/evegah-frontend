import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionUpdateComponent } from './version-update.component';

describe('UserWalletDetailsComponent', () => {
  let component: VersionUpdateComponent;
  let fixture: ComponentFixture<VersionUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
