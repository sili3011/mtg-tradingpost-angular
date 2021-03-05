import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { autorun, IReactionDisposer } from 'mobx';
import { Subject, Subscription } from 'rxjs';
import { onSideNavChange, animateText } from 'src/app/animations/animations';
import { defaultDeck } from 'src/app/defaults/database.defaults';
import { Deck } from 'src/app/models/deck';
import { LISTTYPES } from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';
import { DecksStore } from 'src/app/stores/decks.store';
import { AddCardAmountToDeckDialogComponent } from '../dialogs/add-card-amount-to-deck-dialog/add-card-amount-to-deck-dialog.component';

@Component({
  selector: 'mtg-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  animations: [onSideNavChange, animateText],
})
export class NavigationComponent implements OnInit, OnDestroy {
  sideNavState = false;
  linkText = false;
  onSideNavChange = false;
  sideNavState$: Subject<boolean> = new Subject();

  decks: Array<Deck> = [];
  selectedDeck: Deck | undefined;

  subscriptions: Subscription = new Subscription();
  disposer!: IReactionDisposer;

  constructor(
    private decksStore: DecksStore,
    private dbService: DBService,
    private dialog: MatDialog
  ) {
    this.subscriptions.add(
      this.sideNavState$.subscribe((res) => {
        this.onSideNavChange = res;
      })
    );
  }

  ngOnInit(): void {
    this.disposer = autorun(() => (this.decks = this.decksStore.decks));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.disposer();
  }

  onSidenavToggle(state: boolean) {
    this.sideNavState = state;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
    this.sideNavState$.next(this.sideNavState);
  }

  addDeck() {
    this.dbService.addDeck(defaultDeck);
  }

  removeDeck(deck: Deck, $event: any) {
    if (deck === this.selectedDeck) {
      this.selectedDeck = undefined;
    }
    this.dbService.removeDeck(deck);
    $event.preventDefault();
  }

  onDeckNameChange($event: any, deck: Deck) {
    deck.name = $event.target.value;
    this.dbService.nameDeck(deck);
  }

  dropCardOnDeck($event: any, deck: Deck) {
    const card = $event.item.data;
    const ref = this.dialog.open(AddCardAmountToDeckDialogComponent, {
      data: { name: card.name, amount: card.amount },
    });
    const sub = ref.afterClosed().subscribe(() => {
      if (ref.componentInstance.confirmed) {
        this.dbService.addCard(
          card,
          LISTTYPES.DECK,
          deck.id,
          ref.componentInstance.amount
        );
      }
      sub.unsubscribe();
    });
  }
}
