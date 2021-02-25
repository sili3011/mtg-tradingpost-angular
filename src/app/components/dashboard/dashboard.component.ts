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
  networth: Networth = defaultNetworth;
  amountOfCards: number = 0;

  constructor(
    private router: Router,
    private userStore: UserStore,
    private cardsStore: CardsStore
  ) {}

  ngOnInit(): void {
    this.disposer = autorun(() => {
      this.owner = this.userStore.owner;
      this.networth = this.cardsStore.networth;
      this.amountOfCards = this.cardsStore.collection.length;
    });
  }

  ngOnDestroy(): void {
    this.disposer();
  }

  goto(name: string) {
    this.router.navigate([`/${name}`]);
  }
}
