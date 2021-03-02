import { Injectable } from '@angular/core';
import { computed, observable } from 'mobx';
import { CardAdapter } from '../models/card-adapter';
import { Networth } from '../services/db.service';
import { defaultNetworth } from '../defaults/database.defaults';
import { CURRENCY } from '../models/enums';

@Injectable({
  providedIn: 'root',
})
export class CardsStore {
  @observable collection: Array<CardAdapter> = [];
  @observable wishlist: Array<CardAdapter> = [];
  @observable networth: Networth = defaultNetworth;

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
        case CURRENCY.EUR:
          this.networth.value +=
            parseFloat(card.prices.eur as string) * card.amount;
          break;
        case CURRENCY.USD:
          this.networth.value +=
            parseFloat(card.prices.usd as string) * card.amount;
          break;
      }
    });
    switch (this.networth.currency) {
      case CURRENCY.EUR:
        return this.networth.value.toFixed(2) + '€';
      case CURRENCY.USD:
        return this.networth.value.toFixed(2) + '$';
    }
    return '';
  }

  constructor() {}
}
