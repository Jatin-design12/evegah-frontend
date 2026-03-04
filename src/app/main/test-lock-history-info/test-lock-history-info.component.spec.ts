import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLockHistoryInfoComponent } from './test-lock-history-info.component';

describe('TestLockHistoryInfoComponent', () => {
  let component: TestLockHistoryInfoComponent;
  let fixture: ComponentFixture<TestLockHistoryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestLockHistoryInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestLockHistoryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
