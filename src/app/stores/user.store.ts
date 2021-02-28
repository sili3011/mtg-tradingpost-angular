import { Injectable } from '@angular/core';
import { observable } from 'mobx';
import { DBService } from '../services/db.service';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  @observable owner: string = '';

  constructor(private dbService: DBService) {
    this.pullFromDB();
  }

  pullFromDB() {
    this.owner = this.dbService.getOwner();
  }
}
