import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCardAmountToDeckDialogComponent } from './add-card-amount-to-deck-dialog.component';

describe('AddCardAmountToDeckDialogComponent', () => {
  let component: AddCardAmountToDeckDialogComponent;
  let fixture: ComponentFixture<AddCardAmountToDeckDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCardAmountToDeckDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCardAmountToDeckDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
