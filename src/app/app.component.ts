import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipComponent } from '@angular/material/tooltip';
import { DatabaseSelectionDialogComponent } from './components/dialogs/database-selection-dialog/database-selection-dialog.component';
import { DBService } from './services/db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'mtg-tradingpost';

  constructor(private dbService: DBService, private dialog: MatDialog) {
    Object.defineProperty(TooltipComponent.prototype, 'message', {
      set(v: any) {
        const el = document.querySelectorAll('.mat-tooltip');

        if (el) {
          el[el.length - 1].innerHTML = v;
        }
      },
    });
  }

  ngOnInit() {
    if (!this.dbService.getHasBeenInitialized()) {
      this.dialog.open(DatabaseSelectionDialogComponent, {
        width: '50%',
        disableClose: true,
      });
    }
  }
}
