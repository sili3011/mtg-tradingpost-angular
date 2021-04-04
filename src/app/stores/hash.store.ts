import { JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { computed, observable } from 'mobx';
import { Hash } from '../models/hash';

@Injectable({
  providedIn: 'root',
})
export class HashStore {
  @observable hashtable: Map<string, JSON> = new Map();

  constructor() {}

  hasSet(setName: string) {
    return this.hashtable.has(setName);
  }

  addToHashtable(setName: string, values: JSON) {
    this.hashtable.set(setName, values);
  }

  @computed get sortedHashes(): Map<string, Hash> {
    const ret: Map<string, Hash> = new Map();
    this.hashtable.forEach((set) => {
      const parsedSet = JSON.parse(JSON.stringify(set));
      parsedSet.forEach((card: Hash) => {
        ret.set(card.hash, card);
        if (card.hash_back) {
          ret.set(card.hash_back, card);
        }
      });
    });
    return new Map([...ret.entries()].sort());
  }
}
