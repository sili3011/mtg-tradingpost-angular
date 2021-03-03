import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IReactionDisposer, autorun } from 'mobx';
import { CardAdapter } from 'src/app/models/card-adapter';
import { Deck } from 'src/app/models/deck';
import { CURRENCY, LISTTYPES } from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';
import { CardsStore } from 'src/app/stores/cards.store';
import { DecksStore } from 'src/app/stores/decks.store';
import { AddCardDialogComponent } from '../dialogs/add-card-dialog/add-card-dialog.component';

@Component({
  selector: 'mtg-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss'],
})
export class CardsListComponent implements OnInit, OnChanges {
  displayedColumns: string[] = [
    'name',
    'set',
    'mana_cost',
    'cmc',
    'value',
    'amount',
  ];
  dataSource: MatTableDataSource<CardAdapter>;

  @Input()
  listType!: LISTTYPES;

  ListTypes = LISTTYPES;

  @Input()
  deck: Deck | undefined;

  decks: Array<string> = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedCurrency!: CURRENCY;
  Currencies = CURRENCY;

  cardsList: Array<CardAdapter> = [];

  disposer!: IReactionDisposer;

  constructor(
    private cardsStore: CardsStore,
    private decksStore: DecksStore,
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
      this.decks = this.decksStore.decks.map((d) => d.id);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (card, sortHeaderId) => {
      switch (sortHeaderId) {
        case 'name':
          return card.name;
        case 'set':
          return card.set;
        case 'mana_cost':
          return card.mana_cost!;
        case 'cmc':
          return card.cmc;
        case 'value':
          switch (this.selectedCurrency) {
            case CURRENCY.EUR:
              return parseFloat(card.prices.eur!);
            case CURRENCY.USD:
              return parseFloat(card.prices.usd!);
          }
        case 'amount':
          return card.amount;
        default:
          return '';
      }
    };
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.deck) {
      this.cardsList = this.deck?.cards!;
      this.reapplyDatasource();
    }
  }

  ngOnDestroy(): void {
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

  increment(card: CardAdapter) {
    this.dbService.increment(card, this.listType, this.deck?.id);
  }

  decrement(card: CardAdapter) {
    if (!this.dbService.decrement(card, this.listType, this.deck?.id)) {
      this.reapplyDatasource();
    }
  }

  openAddCardDialog() {
    const subscription = this.dialog
      .open(AddCardDialogComponent, {
        width: '50%',
        data: this.listType,
      })
      .afterClosed()
      .subscribe(() => {
        this.reapplyDatasource();
        subscription.unsubscribe();
      });
  }

  private reapplyDatasource() {
    this.dataSource = new MatTableDataSource(this.cardsList);
    this.dataSource.paginator = this.paginator;
  }
}
