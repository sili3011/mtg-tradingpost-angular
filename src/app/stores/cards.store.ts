import { Injectable, OnInit } from '@angular/core';
import { observable } from 'mobx';
import { DefaultDeserializer } from 'v8';
import { CardAdapter } from '../models/card-adapter';
import { Networth } from '../services/db.service';
import { defaultNetworth } from '../defaults/database.defaults';

@Injectable({
  providedIn: 'root',
})
export class CardsStore implements OnInit {
  @observable collection: Array<CardAdapter> = [];
  @observable wishlist: Array<CardAdapter> = [];
  @observable networth: Networth = defaultNetworth;

  ngOnInit(): void {}
}
