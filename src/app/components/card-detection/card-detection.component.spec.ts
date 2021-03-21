import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDetectionComponent } from './card-detection.component';

describe('CardDetectionComponent', () => {
  let component: CardDetectionComponent;
  let fixture: ComponentFixture<CardDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardDetectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
