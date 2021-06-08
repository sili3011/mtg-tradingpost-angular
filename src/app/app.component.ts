import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipComponent } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import Dexie from 'dexie';
import {
  GuidedTour,
  GuidedTourService,
  Orientation,
  TourStep,
} from 'ngx-guided-tour';
import { DatabaseSelectionDialogComponent } from './components/dialogs/database-selection-dialog/database-selection-dialog.component';
import { TooSmallWarningDialogComponent } from './components/dialogs/too-small-warning-dialog/too-small-warning-dialog.component';
import { DBService } from './services/db.service';
import { HashStore } from './stores/hash.store';
import { BreakpointObserver } from '@angular/cdk/layout';

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
    private guidedTourService: GuidedTourService,
    private breakpointObserver: BreakpointObserver
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
    this.startTour();

    this.breakpointObserver
      .observe(['(max-width: 999px)'])
      .subscribe((result) => {
        if (result.matches) {
          this.dialog.open(TooSmallWarningDialogComponent, {});
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
        this.startTour();
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
        this.startTour();
      });
    }
  }

  startTour(): void {
    this.guidedTourService.startTour(this.tour);
    window.dispatchEvent(new Event('resize'));
  }

  steps: Array<TourStep> = [
    {
      title: 'Greetings!',
      content:
        'We detected that this is your first visit! Mind to go on a short tour with us?',
    },
    {
      selector: '.dashboard',
      title: 'Dashboard',
      content:
        'This is the center of operations, you can go everywhere from here.',
      orientation: Orientation.Center,
    },
    {
      selector: '.to-dashboard',
      title: 'Coming back',
      content:
        'You can get back to the dashboard from anywhere by clicking on the mtg-tradingpost logo.',
      orientation: Orientation.Bottom,
    },
    {
      selector: '.to-settings',
      title: 'Settings!',
      content: 'Lets start with the settings.',
      orientation: Orientation.TopLeft,
      closeAction: () => {
        this.router.navigate([`/settings`]);
      },
    },
    {
      title: 'Settings!',
      content: 'These are settings.',
    },
    {
      selector: '.preferences',
      title: 'Preferences',
      content: 'These are your personal preferences.',
      orientation: Orientation.Bottom,
      highlightPadding: 15,
    },
    {
      selector: '.database',
      title: 'Database management',
      content:
        'You already know this if you didnt create an account. If you are using this online you can safely ignore this.',
      orientation: Orientation.Top,
      highlightPadding: 15,
    },
    {
      selector: '.backup',
      title: 'Backup your data',
      content:
        'You can download your data as a JSON to back it up locally. Essential if you are working without an account useful but not necassary if you have an account.',
      orientation: Orientation.Top,
      highlightPadding: 10,
    },
  ];

  tour: GuidedTour = {
    tourId: 'starter',
    useOrb: false,
    steps: this.steps,
  };
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
