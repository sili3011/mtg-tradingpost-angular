import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mtg-database-selection-dialog',
  templateUrl: './database-selection-dialog.component.html',
  styleUrls: ['./database-selection-dialog.component.scss'],
})
export class DatabaseSelectionDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DatabaseSelectionDialogComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
