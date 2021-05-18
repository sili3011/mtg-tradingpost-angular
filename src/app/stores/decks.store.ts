import { Injectable } from '@angular/core';
import { computed, observable } from 'mobx';
import { Deck } from '../models/deck';

@Injectable({
  providedIn: 'root',
})
export class DecksStore {
  @observable decks: Array<Deck> = [];

  constructor() {}

  @computed activeAmount() {
    return this.decks.filter((d) => d.active).length;
  }

  @computed playableAmount() {
    return this.decks.filter((d) => d.active).filter((d) => d.playable).length;
  }

  @computed unplayableAmount() {
    return this.decks.filter((d) => d.active).filter((d) => !d.playable).length;
  }
}
