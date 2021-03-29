import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipComponent } from '@angular/material/tooltip';
import { DatabaseSelectionDialogComponent } from './components/dialogs/database-selection-dialog/database-selection-dialog.component';
import { DBService } from './services/db.service';
import { HashStore } from './stores/hash.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'mtg-tradingpost';

  backendURL = 'https://mtg-tradingpost-backend.web.app/';

  constructor(
    private dbService: DBService,
    private hashStore: HashStore,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
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

    this.http.get<Array<string>>(this.backendURL + 'sets').subscribe((sets) =>
      sets.forEach((set) => {
        if (!this.hashStore.hasSet(set)) {
          this.http
            .get<JSON>(this.backendURL + set)
            .subscribe((json) => this.hashStore.addToHashtable(set, json));
        }
      })
    );
  }
}
