import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mtg-too-small-warning-dialog',
  templateUrl: './too-small-warning-dialog.component.html',
  styleUrls: ['./too-small-warning-dialog.component.scss'],
})
export class TooSmallWarningDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<TooSmallWarningDialogComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
