import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxOpeningComponent } from './box-opening.component';

describe('BoxOpeningComponent', () => {
  let component: BoxOpeningComponent;
  let fixture: ComponentFixture<BoxOpeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxOpeningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxOpeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
