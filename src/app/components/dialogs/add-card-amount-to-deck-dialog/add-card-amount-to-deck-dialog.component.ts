import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'mtg-add-card-amount-to-deck-dialog',
  templateUrl: './add-card-amount-to-deck-dialog.component.html',
  styleUrls: ['./add-card-amount-to-deck-dialog.component.scss'],
})
export class AddCardAmountToDeckDialogComponent implements OnInit {
  name: string = '';
  amount: number = 1;
  confirmed: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddCardAmountToDeckDialogComponent>,
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
