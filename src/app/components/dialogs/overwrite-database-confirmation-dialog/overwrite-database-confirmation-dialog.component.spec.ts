import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverwriteDatabaseConfirmationDialogComponent } from './overwrite-database-confirmation-dialog.component';

describe('OverwriteDatabaseConfirmationDialogComponent', () => {
  let component: OverwriteDatabaseConfirmationDialogComponent;
  let fixture: ComponentFixture<OverwriteDatabaseConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverwriteDatabaseConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwriteDatabaseConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
