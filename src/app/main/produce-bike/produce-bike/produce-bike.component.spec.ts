import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduceBikeComponent } from './produce-bike.component';

describe('ProduceBikeComponent', () => {
  let component: ProduceBikeComponent;
  let fixture: ComponentFixture<ProduceBikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduceBikeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduceBikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
