import { Injectable } from '@angular/core';
import { computed, observable } from 'mobx';
import { Deck } from '../models/deck';

@Injectable({
  providedIn: 'root',
})
export class DecksStore {
  @observable decks: Array<Deck> = [];

  constructor() {}

  @computed playableAmount() {
    return this.decks.filter((d) => d.playable).length;
  }

  @computed unplayableAmount() {
    return this.decks.filter((d) => !d.playable).length;
  }
}
