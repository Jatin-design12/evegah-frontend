import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeWiseListComponent } from './bike-wise-list.component';

describe('BikeWiseListComponent', () => {
  let component: BikeWiseListComponent;
  let fixture: ComponentFixture<BikeWiseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BikeWiseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BikeWiseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
