import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mtg-too-small-warning-dialog',
  templateUrl: './too-small-warning-dialog.component.html',
  styleUrls: ['./too-small-warning-dialog.component.scss'],
})
export class TooSmallWarningDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<TooSmallWarningDialogComponent>,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe(['(min-width: 1000px)'])
      .subscribe((result) => {
        if (result.matches) {
          this.close();
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
