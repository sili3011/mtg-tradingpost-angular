import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseSelectionDialogComponent } from './database-selection-dialog.component';

describe('DatabaseSelectionDialogComponent', () => {
  let component: DatabaseSelectionDialogComponent;
  let fixture: ComponentFixture<DatabaseSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseSelectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
