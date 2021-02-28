import { Injectable } from '@angular/core';
import { observable } from 'mobx';
import { CardAdapter } from '../models/card-adapter';
import { DBService, Networth } from '../services/db.service';
import { defaultNetworth } from '../defaults/database.defaults';
import { CURRENCY, LISTTYPES } from '../models/enums';

@Injectable({
  providedIn: 'root',
})
export class CardsStore {
  @observable collection: Array<CardAdapter> = [];
  @observable wishlist: Array<CardAdapter> = [];
  @observable networth: Networth = defaultNetworth;

  constructor(private dbService: DBService) {
    this.pullFromDB();
  }

  pullFromDB() {
    this.collection = this.dbService.getCards(LISTTYPES.COLLECTION);
    this.wishlist = this.dbService.getCards(LISTTYPES.WISHLIST);
    this.networth = this.dbService.getNetworth();
  }

  setCurrency(cur: CURRENCY) {
    this.networth.currency = cur;
    this.dbService.setNetworth(this.networth);
  }
}
