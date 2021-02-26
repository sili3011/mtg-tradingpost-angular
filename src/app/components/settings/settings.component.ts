import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseSelectionDialogComponent } from '../dialogs/database-selection-dialog/database-selection-dialog.component';

@Component({
  selector: 'mtg-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openDBDialog() {
    this.dialog.open(DatabaseSelectionDialogComponent, {
      width: '50%',
      disableClose: true,
    });
  }
}
