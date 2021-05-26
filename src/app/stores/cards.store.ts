import { Injectable } from '@angular/core';
import { computed, observable } from 'mobx';
import { CardAdapter } from '../models/card-adapter';
import { Networth } from '../services/db.service';
import { defaultNetworth } from '../models/defaults';
import { CURRENCIES } from '../models/enums';
import { DecksStore } from './decks.store';
import { fixPrice, sameCardComparison } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class CardsStore {
  @observable collection: Array<CardAdapter> = [];
  @observable wishlist: Array<CardAdapter> = [];
  @observable networth: Networth = defaultNetworth;

  constructor(private decksStore: DecksStore) {}

  @computed get uniqueCardsCount() {
    return this.collection.length;
  }

  @computed get totalCardsCount() {
    let total = 0;
    this.collection.forEach((card) => {
      total += card.amount;
    });
    return total;
  }

  @computed get setCount() {
    return this.collection
      .map((card) => card.set)
      .filter((set, currentIndex, sets) => sets.indexOf(set) === currentIndex)
      .length;
  }

  @computed get networthWithCurrency() {
    this.networth.value = 0;
    this.collection.forEach((card) => {
      if (card.isFoil) {
        this.networth.value +=
          parseFloat(card.prices.usd_foil as string) * card.amount;
      } else {
        this.networth.value +=
          fixPrice(this.networth.currency, card.prices) * card.amount;
      }
    });
    switch (this.networth.currency) {
      case CURRENCIES.EUR:
        return this.networth.value.toFixed(2) + '€';
      case CURRENCIES.USD:
        return this.networth.value.toFixed(2) + '$';
    }
    return '';
  }

  @computed get missingCards() {
    const neededCards: Array<CardAdapter> = [];
    this.decksStore.decks.forEach((deck) =>
      deck.cards.forEach((card) => {
        const found = neededCards.find((c) => sameCardComparison(c, card));
        if (found) {
          found.amount += card.amount;
        } else {
          neededCards.push(Object.assign({}, card));
        }
      })
    );
    const missingCards: Array<CardAdapter> = [];
    neededCards.forEach((card) => {
      const found = this.collection.find((c) => sameCardComparison(c, card));
      if (found) {
        if (card.amount - found.amount <= 0) {
          return;
        } else {
          card.amount -= found.amount;
        }
      }
      missingCards.push(card);
    });
    return missingCards;
  }
}
