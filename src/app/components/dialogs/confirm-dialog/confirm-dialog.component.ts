import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddCardAmountToDeckDialogComponent } from '../add-card-amount-to-deck-dialog/add-card-amount-to-deck-dialog.component';

@Component({
  selector: 'mtg-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  confirmed: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddCardAmountToDeckDialogComponent>,
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
