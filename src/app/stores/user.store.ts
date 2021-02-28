import { Injectable } from '@angular/core';
import { observable } from 'mobx';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  @observable owner: string = '';

  constructor() {}

  pullFromDB() {}
}
