import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'mtg-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss'],
})
export class InformationDialogComponent {
  header: string = '';
  content: string = '';

  constructor(
    private dialogRef: MatDialogRef<InformationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.header = data.header;
    this.content = data.content;
  }

  close() {
    this.dialogRef.close();
  }
}
