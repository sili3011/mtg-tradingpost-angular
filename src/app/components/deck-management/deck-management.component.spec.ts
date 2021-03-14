import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckManagementComponent } from './deck-management.component';

describe('DeckManagementComponent', () => {
  let component: DeckManagementComponent;
  let fixture: ComponentFixture<DeckManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
