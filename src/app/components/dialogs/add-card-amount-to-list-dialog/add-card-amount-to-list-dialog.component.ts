import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'mtg-add-card-amount-to-list-dialog',
  templateUrl: './add-card-amount-to-list-dialog.component.html',
  styleUrls: ['./add-card-amount-to-list-dialog.component.scss'],
})
export class AddCardAmountToListDialogComponent implements OnInit {
  name: string = '';
  amount: number = 1;
  confirmed: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddCardAmountToListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.name = this.data.name;
  }

  increment() {
    ++this.amount;
  }

  decrement() {
    if (this.amount > 1) {
      --this.amount;
    }
  }

  setAmount() {
    this.amount = this.data.amount;
  }

  close() {
    this.dialogRef.close();
  }

  confirm() {
    this.confirmed = true;
    this.close();
  }
}
