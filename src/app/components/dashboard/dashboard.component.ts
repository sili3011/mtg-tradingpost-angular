import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Prices } from 'scryfall-sdk';
import { CURRENCIES } from 'src/app/models/enums';
import { CardsStore } from 'src/app/stores/cards.store';
import { DecksStore } from 'src/app/stores/decks.store';
import { UserStore } from 'src/app/stores/user.store';
import { fixPrice, imageTooltip } from 'src/app/utils/utils';

@Component({
  selector: 'mtg-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  Currencies = CURRENCIES;

  constructor(
    private router: Router,
    public userStore: UserStore,
    public cardsStore: CardsStore,
    public decksStore: DecksStore
  ) {}

  goto(name: string) {
    this.router.navigate([`/${name}`]);
  }

  imageTooltip(card: any): string {
    return imageTooltip(card, 'normal');
  }

  getFixedPrice(currency: CURRENCIES, prices: Prices): string {
    return (
      fixPrice(currency, prices) + (currency === CURRENCIES.EUR ? '€' : '$')
    );
  }
}
