import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { onSideNavChange, animateText } from 'src/app/animations/animations';
import { defaultDeck } from 'src/app/models/defaults';
import { Deck } from 'src/app/models/deck';
import { LISTTYPES } from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';
import { DecksStore } from 'src/app/stores/decks.store';
import { AddCardAmountToListDialogComponent } from '../dialogs/add-card-amount-to-list-dialog/add-card-amount-to-list-dialog.component';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { CardAdapter } from 'src/app/models/card-adapter';
import StartTour from 'src/app/models/startTour';
import { GuidedTourService } from 'ngx-guided-tour';
import { FeedbackDialogComponent } from '../dialogs/feedback-dialog/feedback-dialog.component';
import { InformationDialogComponent } from '../dialogs/information-dialog/information-dialog.component';

@Component({
  selector: 'mtg-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  animations: [onSideNavChange, animateText],
})
export class NavigationComponent implements OnDestroy {
  sideNavState = false;
  linkText = false;
  onSideNavChange = false;
  sideNavState$: Subject<boolean> = new Subject();

  selectedDeck: Deck | undefined;
  hoveredDeckId = '';

  subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    public decksStore: DecksStore,
    private dbService: DBService,
    private dialog: MatDialog,
    private guidedTourService: GuidedTourService
  ) {
    this.subscriptions.add(
      this.sideNavState$.subscribe((res) => (this.onSideNavChange = res))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSidenavToggle(state: boolean) {
    this.sideNavState = state;
    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
    this.sideNavState$.next(this.sideNavState);
  }

  addDeck($event: any) {
    this.dbService.addDeck(Object.assign({}, defaultDeck));
    this.stopPropagation($event);
  }

  removeDeck(deck: Deck, $event: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Confirm deleting ' + deck.name },
    });
    ref.afterClosed().subscribe(() => {
      if (ref.componentInstance.confirmed) {
        if (deck === this.selectedDeck) {
          this.selectedDeck = undefined;
          this.router.navigate([`/decks`]);
        }
        this.dbService.removeDeck(deck);
      }
    });
    this.stopPropagation($event);
  }

  onDeckNameChange($event: any, deck: Deck) {
    deck.name = $event.target.value;
    this.dbService.nameDeck(deck);
  }

  dropCardOnDeck($event: any, deck: Deck) {
    const card: CardAdapter = $event.item.data;
    const ref = this.dialog.open(AddCardAmountToListDialogComponent, {
      data: { name: card.name, amount: card.amount },
    });
    ref.afterClosed().subscribe(() => {
      if (ref.componentInstance.confirmed) {
        this.dbService.addCard(
          Object.assign({}, card),
          LISTTYPES.DECK,
          deck.id,
          ref.componentInstance.amount,
          card.isFoil
        );
      }
    });
  }

  selectInput($event: any, id: string) {
    document.getElementById('input-' + id)!.focus();
    this.stopPropagation($event);
  }

  goto(name: string) {
    this.router.navigate([`/${name}`]);
  }

  stopPropagation($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  openFeedbackDialog() {
    this.dialog.open(FeedbackDialogComponent, {
      width: '50%',
    });
  }

  openAboutDialog() {
    this.dialog.open(InformationDialogComponent, {
      data: {
        header: 'About',
        content:
          '<span class="tradingpost">TRADINGPOST</span> is an application to keep a digitized version of your collected TCGs organized. Currently only supporting "Magic: The Gathering". <br />  <br />Made by Silvio Schmidt.<br /> Contact me via <a href="mailto:contact@mtg-tradingpost.com" class="primary">contact@mtg-tradingpost.com</a>. <br /> Find the project at <a href="https://github.com/sili3011/mtg-tradingpost-angular" target="_blank" class="primary">GitHub</a>.<br /><br />Portions of TRADINGPOST are unofficial Fan Content permitted under the Wizards of the Coast Fan Content Policy. The literal and graphical information presented on this site about Magic: The Gathering, including card images, the mana symbols, and Oracle text, is copyright Wizards of the Coast, LLC, a subsidiary of Hasbro, Inc. <span class="tradingpost">TRADINGPOST</span> is not produced by, endorsed by, supported by, or affiliated with Wizards of the Coast. <br /> <br /> Card prices and promotional offers represent daily estimates and/or market values. Absolutely no guarantee is made for any price information. See stores for final prices and details.',
      },
    });
  }

  startTour() {
    const tour = new StartTour(this.router, this.guidedTourService);
    tour.startTour();
  }
}
