import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardListComponent } from './inward-list.component';

describe('InwardListComponent', () => {
  let component: InwardListComponent;
  let fixture: ComponentFixture<InwardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InwardListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
