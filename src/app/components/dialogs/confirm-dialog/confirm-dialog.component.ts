import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddCardAmountToListDialogComponent } from '../add-card-amount-to-list-dialog/add-card-amount-to-list-dialog.component';

@Component({
  selector: 'mtg-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  confirmed: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddCardAmountToListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  confirm() {
    this.confirmed = true;
    this.close();
  }
}
