import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseSelectionDialogComponent } from './components/dialogs/database-selection-dialog/database-selection-dialog.component';
import { DBService } from './services/db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'mtg-tradingpost';

  constructor(private dbService: DBService, private dialog: MatDialog) {}

  ngOnInit() {
    if (!this.dbService.getHasBeenInitialized()) {
      this.dialog.open(DatabaseSelectionDialogComponent, {
        width: '50%',
        height: '50%',
        disableClose: true,
      });
    }
  }
}
