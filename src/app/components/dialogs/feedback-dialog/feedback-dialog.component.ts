import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mtg-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss'],
})
export class FeedbackDialogComponent {
  feedbackControl = new FormControl('');
  subjectControl = new FormControl('Account');
  canReproduceControl = new FormControl(false);

  constructor(private dialogRef: MatDialogRef<FeedbackDialogComponent>) {}

  send() {
    console.log(this.feedbackControl.value);
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
