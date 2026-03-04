import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingReplyComponent } from './rating-reply.component';

describe('RatingReplyComponent', () => {
  let component: RatingReplyComponent;
  let fixture: ComponentFixture<RatingReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingReplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
