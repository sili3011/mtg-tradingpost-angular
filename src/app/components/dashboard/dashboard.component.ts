import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { defaultNetworth } from 'src/app/defaults/database.defaults';
import { Networth } from 'src/app/services/db.service';
import { CardsStore } from 'src/app/stores/cards.store';
import { UserStore } from 'src/app/stores/user.store';

@Component({
  selector: 'mtg-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  disposer!: IReactionDisposer;

  owner: string = '';
  totalCardsCount: number = 0;
  uniqueCardsCount: number = 0;
  setCount: number = 0;

  networth: string = '';

  constructor(
    private router: Router,
    private userStore: UserStore,
    private cardsStore: CardsStore
  ) {}

  ngOnInit(): void {
    this.disposer = autorun(() => {
      this.owner = this.userStore.owner;
      this.totalCardsCount = this.cardsStore.totalCardsCount;
      this.uniqueCardsCount = this.cardsStore.uniqueCardsCount;
      this.setCount = this.cardsStore.setCount;
      this.networth = this.cardsStore.networthWithCurrency;
    });
  }

  ngOnDestroy(): void {
    this.disposer();
  }

  goto(name: string) {
    this.router.navigate([`/${name}`]);
  }
}
