import { Injectable } from '@angular/core';
import { computed, observable } from 'mobx';
import { CardAdapter } from '../models/card-adapter';
import { Networth } from '../services/db.service';
import { defaultNetworth } from '../models/defaults';
import { CURRENCIES } from '../models/enums';
import { DecksStore } from './decks.store';

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
      switch (this.networth.currency) {
        case CURRENCIES.EUR:
          if (card.prices.eur) {
            this.networth.value +=
              parseFloat(card.prices.eur as string) * card.amount;
          }
          break;
        case CURRENCIES.USD:
          if (card.prices.usd) {
            this.networth.value +=
              parseFloat(card.prices.usd as string) * card.amount;
          }
          break;
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
        const found = neededCards.find((c) => c.id === card.id);
        if (found) {
          found.amount += card.amount;
        } else {
          neededCards.push(Object.assign({}, card));
        }
      })
    );
    const missingCards: Array<CardAdapter> = [];
    neededCards.forEach((card) => {
      const found = this.collection.find((c) => c.id === card.id);
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
