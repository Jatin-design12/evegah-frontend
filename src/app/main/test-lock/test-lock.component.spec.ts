import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLockComponent } from './test-lock.component';

describe('TestLockComponent', () => {
  let component: TestLockComponent;
  let fixture: ComponentFixture<TestLockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestLockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
