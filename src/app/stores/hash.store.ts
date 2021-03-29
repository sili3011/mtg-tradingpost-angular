import { Injectable } from '@angular/core';
import { computed, observable } from 'mobx';

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
}
