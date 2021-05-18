import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipComponent } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import Dexie from 'dexie';
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

  showLandingpage = true;

  constructor(
    private dbService: DBService,
    private hashStore: HashStore,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router
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

  ngOnInit(): void {
    // if (this.dbService.getHasBeenInitialized()) {
    //   this.showLandingpage = false;
    //   this.gotoApp();
    // }

    if (!this.dbService.getHasBeenInitialized() && !this.showLandingpage) {
      this.dialog.open(DatabaseSelectionDialogComponent, {
        width: '50%',
        disableClose: true,
      });
    }

    var db = new HashtablesDatabase();

    try {
      this.http
        .get<Array<any>>(this.backendURL + 'sets')
        .subscribe(async (sets) => {
          for (const set of sets.map((set) => set.code)) {
            if (!this.hashStore.hasSet(set)) {
              const setInStorage = await db.hashtables
                .where('code')
                .equals(set)
                .first();

              if (setInStorage) {
                this.hashStore.addToHashtable(set, setInStorage.data);
              } else {
                try {
                  this.http
                    .get<JSON>(this.backendURL + set)
                    .subscribe((json) => {
                      db.hashtables.put({ code: set, data: json });
                      this.hashStore.addToHashtable(set, json);
                    });
                } catch (error) {
                  console.log(error);
                }
              }
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  goto(name: string) {
    this.router.navigate([`/${name}`]);
  }

  gotoApp() {
    this.showLandingpage = false;
    this.goto('/dashboard');
    if (!this.dbService.getHasBeenInitialized()) {
      this.dialog.open(DatabaseSelectionDialogComponent, {
        width: '50%',
        disableClose: true,
      });
    }
  }
}

// TODO: put code below somewhere else
class HashtablesDatabase extends Dexie {
  hashtables: Dexie.Table<IHashtable, number>;

  constructor() {
    super('hashtablesDatabase');
    this.version(1).stores({
      hashtables: 'code,data',
    });
    this.hashtables = this.table('hashtables');
  }
}

interface IHashtable {
  code: string;
  data: JSON;
}
