import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { autorun, IReactionDisposer } from 'mobx';
import { Subject } from 'rxjs';
import { onSideNavChange, animateText } from 'src/app/animations/animations';
import { Deck } from 'src/app/models/deck';
import { DECKTYPES } from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';
import { DecksStore } from 'src/app/stores/decks.store';
import { v4 as uuidv4 } from 'uuid';

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

  subscriptions: Array<any> = [];
  disposer!: IReactionDisposer;

  constructor(private decksStore: DecksStore, private dbService: DBService) {
    this.subscriptions.push(
      this.sideNavState$.subscribe((res) => {
        this.onSideNavChange = res;
      })
    );
  }

  ngOnInit(): void {
    this.disposer = autorun(() => (this.decks = this.decksStore.decks));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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
    this.dbService.addDeck({
      id: uuidv4(),
      name: '',
      cards: [],
      type: DECKTYPES.NONE,
      playable: false,
    });
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
}
