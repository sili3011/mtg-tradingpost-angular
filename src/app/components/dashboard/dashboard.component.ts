import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { defaultNetworth } from 'src/app/models/defaults';
import { Deck } from 'src/app/models/deck';
import { Networth } from 'src/app/services/db.service';
import { CardsStore } from 'src/app/stores/cards.store';
import { DecksStore } from 'src/app/stores/decks.store';
import { UserStore } from 'src/app/stores/user.store';
import { CardAdapter } from 'src/app/models/card-adapter';
import { CURRENCIES } from 'src/app/models/enums';
import { imageTooltip } from 'src/app/utils/utils';

@Component({
  selector: 'mtg-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  owner: string = '';
  totalCardsCount: number = 0;
  uniqueCardsCount: number = 0;
  setCount: number = 0;

  networth: string = '';

  decks: Array<Deck> = [];
  playableAmount: number = 0;
  unplayableAmount: number = 0;
  mostWanted?: CardAdapter;
  selectedCurrency!: CURRENCIES;
  Currencies = CURRENCIES;

  disposer!: IReactionDisposer;

  constructor(
    private router: Router,
    private userStore: UserStore,
    private cardsStore: CardsStore,
    private decksStore: DecksStore
  ) {}

  ngOnInit(): void {
    this.disposer = autorun(() => {
      this.owner = this.userStore.owner;
      this.totalCardsCount = this.cardsStore.totalCardsCount;
      this.uniqueCardsCount = this.cardsStore.uniqueCardsCount;
      this.setCount = this.cardsStore.setCount;
      this.networth = this.cardsStore.networthWithCurrency;
      this.decks = this.decksStore.decks;
      this.playableAmount = this.decks.filter((d) => d.playable).length;
      this.unplayableAmount = this.decks.filter((d) => !d.playable).length;
      this.mostWanted = this.cardsStore.wishlist[0];
      this.selectedCurrency = this.cardsStore.networth.currency;
    });
  }

  ngOnDestroy(): void {
    this.disposer();
  }

  goto(name: string) {
    this.router.navigate([`/${name}`]);
  }

  imageTooltip(card: any): string {
    return imageTooltip(card);
  }
}
