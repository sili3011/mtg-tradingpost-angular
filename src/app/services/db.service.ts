import { Injectable } from '@angular/core';
import { CardIdentifier, Cards } from 'scryfall-sdk';
import { defaultDB, defaultNetworth } from '../defaults/database.defaults';
import { CardAdapter } from '../models/card-adapter';
import { Deck } from '../models/deck';
import { LISTTYPES } from '../models/enums';
import { CollectionChain } from 'lodash';
import * as db from '../../assets/db.json';
import * as LocalStorage from 'lowdb/adapters/LocalStorage';
import * as lowdb from 'lowdb';
import { UserStore } from '../stores/user.store';
import { CardsStore } from '../stores/cards.store';

export interface Networth {
  value: number;
  currency: string;
  lastSync: number;
}

interface DB extends File {
  hasBeenInitialized: boolean;
  name: string;
  owner: string;
  collection: Array<CardAdapter>;
  wishlist: Array<CardAdapter>;
  decks: Array<Deck>;
  networth: Networth;
}

@Injectable({
  providedIn: 'root',
})
export class DBService {
  private db!: lowdb.LowdbSync<DB>;
  private adapter = new LocalStorage(JSON.stringify(db));

  constructor(private userStore: UserStore, private cardsStore: CardsStore) {
    this.db = lowdb(this.adapter);
    this.db.defaults(defaultDB).write();
    // init stores
    if (this.getHasBeenInitialized()) {
      this.userStore.owner = this.getOwner();
      this.cardsStore.collection = this.getCards(LISTTYPES.collection);
      this.cardsStore.wishlist = this.getCards(LISTTYPES.whishlist);
      this.cardsStore.networth = this.getNetworth();
      // store.commit('setDecks', { decks: this.getDecks() });
    }
  }

  setDB(input: DB) {
    this.db!.setState(input).write();
  }

  createBackup(): File {
    return this.db!.toJSON();
  }

  setHasBeenInitialized(input: boolean) {
    this.db!.set('hasBeenInitialized', input).write();
  }

  getHasBeenInitialized(): boolean {
    return this.db!.get('hasBeenInitialized').value();
  }

  setName(name: string) {
    this.db!.set('name', name).write();
  }

  getName(): string {
    return this.db!.get('name').value();
  }

  setOwner(owner: string) {
    this.db!.set('owner', owner).write();
  }

  getOwner(): string {
    return this.db!.get('owner').value();
  }

  setCollection(collection: Array<CardAdapter>) {
    this.db!.set('collection', collection).write();
  }

  getCollection(): Array<CardAdapter> {
    return this.db!.get('collection').value();
  }

  setWishlist(wishlist: Array<CardAdapter>) {
    this.db!.set('wishlist', wishlist).write();
  }

  getWishlist(): Array<CardAdapter> {
    return this.db!.get('wishlist').value();
  }

  getCards(listType: number): Array<CardAdapter> {
    switch (listType) {
      case LISTTYPES.collection:
        return this.getCollection();
      case LISTTYPES.whishlist:
        return this.getWishlist();
      default:
        return [];
    }
  }

  getCollectionChainCards(listType: LISTTYPES): CollectionChain<CardAdapter> {
    switch (listType) {
      case LISTTYPES.collection:
        return this.db!.get('collection');
      case LISTTYPES.whishlist:
        return this.db!.get('wishlist');
    }
  }

  setNetworth(networth: any) {
    this.db!.set('networth', networth).write();
  }

  getNetworth(): Networth {
    return this.db!.get('networth').value();
  }

  updateCardValue() {
    // const currentValue = store.getters.getCollectionValue;
    // this.db!.set('networth.value', currentValue).write();
    this.db!.set('networth.lastSync', new Date().getTime()).write();
    //UPDATE VALUE OF EACH CARD
    const identifiers: Array<CardIdentifier> = [];
    const cards = this.getCollection();
    cards.forEach((c) => {
      identifiers.push({ id: c.id });
    });
    Cards.collection(...identifiers).on(
      'data',
      (data) => (cards.find((c) => c.id === data.id)!.prices = data.prices)
    );
    // store.commit('setCardsOfCollection', {
    //   networth: this.getCards(LISTTYPES.collection),
    // });
  }

  addCard(card: CardAdapter, listType: number): CardAdapter | undefined {
    if (
      this.getCollectionChainCards(listType)!
        .find((c: CardAdapter) => c.id === card.id)
        .value()
    ) {
      return undefined;
    }
    card.amount = 1;
    this.getCollectionChainCards(listType)!.push(card).write();
    return this.getCollectionChainCards(listType)!
      .find((c: CardAdapter) => c.id === card.id)
      .value();
  }

  increment(card: CardAdapter, listType: number) {
    const inDB = this.getCollectionChainCards(listType)!.find(
      (c: CardAdapter) => c.id === card.id
    );
    const currentAmount = inDB.value().amount;
    inDB.assign({ amount: currentAmount + 1 }).write();
  }

  decrement(card: CardAdapter, listType: number): boolean {
    const inDB = this.getCollectionChainCards(listType)!.find(
      (c: CardAdapter) => c.id === card.id
    );
    const currentAmount = inDB.value().amount;
    if (currentAmount - 1 === 0) {
      this.getCollectionChainCards(listType)!
        .remove((c: CardAdapter) => c === inDB.value())
        .write();
      return false;
    }
    inDB.assign({ amount: currentAmount - 1 }).write();
    return true;
  }

  setDecks(decks: Array<Deck>) {
    this.db!.set('decks', decks).write();
  }

  getDecks(): Array<Deck> {
    return this.db!.get('decks').value();
  }

  addDeck(deck: Deck) {
    this.db!.get('decks').push(deck).write();
  }

  removeDeck(deck: Deck): Array<Deck> {
    const decks = this.db!.get('decks').value();
    const index = decks.indexOf(deck);
    decks.splice(index, 1);
    this.setDecks(decks);
    return this.db!.get('decks').value();
  }

  nameDeck(deck: Deck) {
    const inDB = this.db!.get('decks').find((d: Deck) => d.id === deck.id);
    inDB.assign({ name: deck.name }).write();
  }

  createNewDB(name: string, owner: string) {
    this.resetDB();
    this.setName(name);
    this.setOwner(owner);
    this.setHasBeenInitialized(true);
  }

  resetDB() {
    this.setCollection([]);
    this.setWishlist([]);
    this.setNetworth(defaultNetworth);
  }
}
