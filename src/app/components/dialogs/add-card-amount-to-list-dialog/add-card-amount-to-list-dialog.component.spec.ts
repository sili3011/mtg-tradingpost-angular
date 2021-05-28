import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCardAmountToListDialogComponent } from './add-card-amount-to-list-dialog.component';

describe('AddCardAmountToDeckDialogComponent', () => {
  let component: AddCardAmountToListDialogComponent;
  let fixture: ComponentFixture<AddCardAmountToListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCardAmountToListDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCardAmountToListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
