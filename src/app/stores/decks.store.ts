import { Injectable } from '@angular/core';
import { observable } from 'mobx';
import { Deck } from '../models/deck';

@Injectable({
  providedIn: 'root',
})
export class DecksStore {
  @observable decks: Array<Deck> = [];

  constructor() {}
}
