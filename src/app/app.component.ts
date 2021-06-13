import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipComponent } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import Dexie from 'dexie';
import { DatabaseSelectionDialogComponent } from './components/dialogs/database-selection-dialog/database-selection-dialog.component';
import { TooSmallWarningDialogComponent } from './components/dialogs/too-small-warning-dialog/too-small-warning-dialog.component';
import { DBService } from './services/db.service';
import { HashStore } from './stores/hash.store';
import { BreakpointObserver } from '@angular/cdk/layout';
import StartTour from './models/startTour';
import { GuidedTourService } from 'ngx-guided-tour';

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
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private guidedTourService: GuidedTourService
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
    // TODO: remove
    // const tour = new StartTour(this.router, this.guidedTourService);
    // tour.startTour();
    // const ref = this.dialog.open(DatabaseSelectionDialogComponent, {
    //   width: '50%',
    //   disableClose: true,
    // });

    this.breakpointObserver
      .observe(['(max-width: 999px)'])
      .subscribe((result) => {
        if (result.matches) {
          this.dialog.open(TooSmallWarningDialogComponent, {});
          if (this.guidedTourService.currentTourStepCount) {
            this.guidedTourService.skipTour();
          }
        }
      });

    if (this.dbService.getHasBeenInitialized()) {
      this.showLandingpage = false;
      this.gotoApp();
    }

    if (!this.dbService.getHasBeenInitialized() && !this.showLandingpage) {
      const ref = this.dialog.open(DatabaseSelectionDialogComponent, {
        width: '50%',
        disableClose: true,
      });
      ref.afterClosed().subscribe(() => {
        const tour = new StartTour(this.router, this.guidedTourService, true);
        tour.startTour();
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

  gotoApp(): void {
    this.showLandingpage = false;
    this.goto('/dashboard');
    if (!this.dbService.getHasBeenInitialized()) {
      const ref = this.dialog.open(DatabaseSelectionDialogComponent, {
        width: '50%',
        disableClose: true,
      });
      ref.afterClosed().subscribe(() => {
        const tour = new StartTour(this.router, this.guidedTourService, true);
        tour.startTour();
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
