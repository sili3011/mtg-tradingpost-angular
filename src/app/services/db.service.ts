import { Injectable } from '@angular/core';
import { CardIdentifier, Cards } from 'scryfall-sdk';
import { defaultDB, defaultNetworth } from '../models/defaults';
import { CardAdapter } from '../models/card-adapter';
import { Deck } from '../models/deck';
import { CURRENCIES, LISTTYPES } from '../models/enums';
import { CollectionChain } from 'lodash';
import * as db from '../../assets/db.json';
import * as LocalStorage from 'lowdb/adapters/LocalStorage';
import * as lowdb from 'lowdb';
import { UserStore } from '../stores/user.store';
import { CardsStore } from '../stores/cards.store';
import { DecksStore } from '../stores/decks.store';
import { sameCardComparison } from '../utils/utils';

export interface Networth {
  value: number;
  currency: CURRENCIES;
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

  constructor(
    private userStore: UserStore,
    private cardsStore: CardsStore,
    private decksStore: DecksStore
  ) {
    this.db = lowdb(this.adapter);
    this.db.defaults(defaultDB).write();
    this.initStores();
  }

  initStores() {
    this.userStore.owner = this.getOwner();
    this.cardsStore.collection = this.getCards(LISTTYPES.COLLECTION);
    this.cardsStore.wishlist = this.getCards(LISTTYPES.WISHLIST);
    this.cardsStore.networth = this.getNetworth();
    this.decksStore.decks = this.getDecks();
  }

  setDB(input: DB) {
    this.db!.setState(input).write();
    this.initStores();
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
      case LISTTYPES.COLLECTION:
        return this.getCollection();
      case LISTTYPES.WISHLIST:
        return this.getWishlist();
      default:
        return [];
    }
  }

  getCollectionChainCards(
    listType: LISTTYPES,
    deckId?: string
  ): CollectionChain<CardAdapter> {
    switch (listType) {
      case LISTTYPES.COLLECTION:
        return this.db!.get('collection');
      case LISTTYPES.WISHLIST:
        return this.db!.get('wishlist');
      case LISTTYPES.DECK:
        return this.db!.get('decks')
          .find((d: Deck) => d.id === deckId)
          .get('cards');
    }
  }

  setNetworth(networth: any) {
    this.db!.set('networth', networth).write();
  }

  getNetworth(): Networth {
    return this.db!.get('networth').value();
  }

  setCurrency(currency: CURRENCIES) {
    this.db!.set('networth.currency', currency).write();
  }

  addCard(
    card: CardAdapter,
    listType: number,
    deckId?: string,
    amount?: number,
    isFoil?: boolean
  ) {
    card.isFoil = isFoil ? isFoil : card.isFoil;
    if (
      this.getCollectionChainCards(listType, deckId)!
        .find((c: CardAdapter) => sameCardComparison(c, card))
        .value()
    ) {
      this.increment(card, listType, deckId, amount);
      return;
    }
    card.amount = amount ? amount : 1;
    this.getCollectionChainCards(listType, deckId)!.push(card).write();
  }

  increment(
    card: CardAdapter,
    listType: number,
    deckId?: string,
    amount?: number
  ) {
    const inDB = this.getCollectionChainCards(
      listType,
      deckId
    )!.find((c: CardAdapter) => sameCardComparison(c, card));
    const currentAmount = inDB.value().amount;
    inDB.assign({ amount: currentAmount + (amount ? amount : 1) }).write();
  }

  decrement(card: CardAdapter, listType: number, deckId?: string): boolean {
    const inDB = this.getCollectionChainCards(
      listType,
      deckId
    )!.find((c: CardAdapter) => sameCardComparison(c, card));
    const currentAmount = inDB.value().amount;
    if (currentAmount - 1 === 0) {
      this.getCollectionChainCards(listType, deckId)!
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

  setDeck(deck: Deck) {
    const inDB = this.db!.get('decks').find((d: Deck) => d.id === deck.id);
    inDB.assign(deck).write();
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
    this.initStores();
  }

  resetDB() {
    this.setCollection([]);
    this.setWishlist([]);
    this.setNetworth(defaultNetworth);
  }
}
