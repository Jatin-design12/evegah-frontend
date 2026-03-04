import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoFencingComponent } from './geo-fencing.component';

describe('GeoFencingComponent', () => {
  let component: GeoFencingComponent;
  let fixture: ComponentFixture<GeoFencingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoFencingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoFencingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
