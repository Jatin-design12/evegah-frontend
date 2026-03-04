import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDataListComponent } from './booking-data-list.component';

describe('BookingDataListComponent', () => {
  let component: BookingDataListComponent;
  let fixture: ComponentFixture<BookingDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingDataListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
