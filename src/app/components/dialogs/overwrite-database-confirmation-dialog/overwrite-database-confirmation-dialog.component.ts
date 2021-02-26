import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mtg-overwrite-database-confirmation-dialog',
  templateUrl: './overwrite-database-confirmation-dialog.component.html',
  styleUrls: ['./overwrite-database-confirmation-dialog.component.scss'],
})
export class OverwriteDatabaseConfirmationDialogComponent implements OnInit {
  confirmed = false;

  constructor(
    private dialogRef: MatDialogRef<OverwriteDatabaseConfirmationDialogComponent>
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  cancel() {
    this.confirmed = false;
    this.close();
  }

  confirm() {
    this.close();
  }
}
