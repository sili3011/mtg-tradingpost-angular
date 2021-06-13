import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mtg-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss'],
})
export class FeedbackDialogComponent {
  constructor(private dialogRef: MatDialogRef<FeedbackDialogComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
