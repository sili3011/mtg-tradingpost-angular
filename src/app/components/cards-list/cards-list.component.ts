import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IReactionDisposer, autorun } from 'mobx';
import { Prices } from 'scryfall-sdk';
import { CardAdapter } from 'src/app/models/card-adapter';
import { CURRENCY, LISTTYPES } from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';
import { CardsStore } from 'src/app/stores/cards.store';
import { AddCardDialogComponent } from '../dialogs/add-card-dialog/add-card-dialog.component';

@Component({
  selector: 'mtg-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss'],
})
export class CardsListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'set',
    'mana_cost',
    'cmc',
    'prices.eur',
    'amount',
  ];
  dataSource: MatTableDataSource<CardAdapter>;

  @Input()
  listType!: LISTTYPES;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedCurrency!: CURRENCY;

  cardsList: Array<CardAdapter> = [];

  disposer!: IReactionDisposer;

  constructor(
    private cardsStore: CardsStore,
    private dbService: DBService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.disposer = autorun(() => {
      switch (this.listType) {
        case LISTTYPES.COLLECTION:
          this.cardsList = this.cardsStore.collection;
          break;
        case LISTTYPES.WISHLIST:
          this.cardsList = this.cardsStore.wishlist;
          break;
      }
      this.dataSource = new MatTableDataSource(this.cardsList);
      this.selectedCurrency = this.cardsStore.networth.currency;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.disposer();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  manas(manaCost: string) {
    let filtered: Array<string> = [];
    manaCost
      .split('{')
      .filter((_) => _ !== '')
      .forEach((_) => filtered.push(_.replace('}', '').replace('/', '')));
    filtered = filtered.map((_) => (_ = _.toLowerCase()));
    return filtered;
  }

  imageTooltip(image: string): string {
    return `<img src="${image}" style="border-radius: 25px;">`;
  }

  getPriceByCurrency(prices: Prices): string {
    switch (this.selectedCurrency) {
      case CURRENCY.EUR:
        return prices.eur + '€';
      case CURRENCY.USD:
        return prices.usd + '$';
    }
    return '';
  }

  increment(card: CardAdapter) {
    this.dbService.increment(card, this.listType);
  }

  decrement(card: CardAdapter) {
    if (!this.dbService.decrement(card, this.listType)) {
      this.dataSource = new MatTableDataSource(this.cardsList);
    }
  }

  openAddCardDialog() {
    this.dialog.open(AddCardDialogComponent, {
      width: '50%',
    });
  }
}
