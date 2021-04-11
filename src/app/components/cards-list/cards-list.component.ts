import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IReactionDisposer, autorun } from 'mobx';
import { CardAdapter } from 'src/app/models/card-adapter';
import { Format } from 'src/app/models/constants';
import { Deck } from 'src/app/models/deck';
import { CURRENCIES, FORMATS, LISTTYPES } from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';
import { CardsStore } from 'src/app/stores/cards.store';
import { DecksStore } from 'src/app/stores/decks.store';
import {
  DeckValidation,
  imageTooltip,
  sameCardComparison,
} from 'src/app/utils/utils';
import { AddCardDialogComponent } from '../dialogs/add-card-dialog/add-card-dialog.component';

@Component({
  selector: 'mtg-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss'],
})
export class CardsListComponent implements OnInit, OnChanges, AfterViewInit {
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
  Formats = FORMATS;

  @Input()
  deck?: Deck;

  decks: Array<string> = [];

  @Input()
  format?: Format;

  @Input()
  deckValidation?: DeckValidation;

  @Input()
  missingCards: Array<CardAdapter> = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedCurrency!: CURRENCIES;
  Currencies = CURRENCIES;

  cardsList: Array<CardAdapter> = [];

  @Output() rerender: EventEmitter<boolean> = new EventEmitter();

  @Input()
  expanded: boolean = false;

  @Input()
  bigCards: boolean = false;

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
          this.decks = this.decksStore.decks.map((d) => d.id);
          this.cardsList = this.cardsStore.collection;
          break;
        case LISTTYPES.WISHLIST:
          this.cardsList = this.cardsStore.wishlist;
          break;
      }
      this.dataSource = new MatTableDataSource(this.cardsList);
      this.selectedCurrency = this.cardsStore.networth.currency;
      if (this.deck || this.listType === this.ListTypes.WISHLIST) {
        this.displayedColumns.push('actions');
      }
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
            case CURRENCIES.EUR:
              return parseFloat(card.prices.eur!);
            case CURRENCIES.USD:
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
    if (
      changes.listType &&
      changes.listType.previousValue !== changes.listType.currentValue
    ) {
      if (changes.listType.currentValue === LISTTYPES.DECK) {
        this.cardsList = this.deck?.cards!;
      }
      if (changes.listType.currentValue === LISTTYPES.SIDEBOARD) {
        this.cardsList = this.deck?.sideboard!;
      }
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

  increment(card: any) {
    this.dbService.increment(card, this.listType, this.deck?.id);
    this.rerender.emit(true);
  }

  decrement(card: any) {
    if (!this.dbService.decrement(card, this.listType, this.deck?.id)) {
      this.reapplyDatasource();
    }
    this.rerender.emit(true);
  }

  openAddCardDialog() {
    const subscription = this.dialog
      .open(AddCardDialogComponent, {
        width: '50%',
        data: { listType: this.listType, deckId: this.deck?.id },
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
    this.rerender.emit(true);
  }

  setPageSize(size: number) {
    this.dataSource.paginator?._changePageSize(size);
  }

  isCommander(): boolean {
    return this.deck!.format === Object.values(FORMATS)[FORMATS.COMMANDER];
  }

  canBeCommander(card: CardAdapter): boolean {
    const cardTypes = card.type_line.toLowerCase().split(' ');
    return (
      cardTypes.includes('legendary') &&
      (cardTypes.includes('creature') || cardTypes.includes('planeswalker'))
    );
  }

  assignAsCommander(card: CardAdapter) {
    this.deck!.commander = card;
    this.dbService.setDeck(this.deck!);
  }

  canBeCompanion(card: any): boolean {
    return card.keywords.includes('Companion');
  }

  assignAsCompanion(card: CardAdapter) {
    this.deck!.companion = card;
    this.dbService.setDeck(this.deck!);
  }

  deassignAsCompanion() {
    this.deck!.companion = undefined;
    this.dbService.setDeck(this.deck!);
  }

  moveTo(card: CardAdapter, listType: LISTTYPES, deckId?: string) {
    this.dbService.addCard(
      Object.assign({}, card),
      listType,
      deckId,
      undefined,
      card.isFoil
    );
    if (listType !== LISTTYPES.WISHLIST) {
      this.decrement(card);
    }
  }

  imageTooltip(card: any): string {
    return imageTooltip(card, 'normal');
  }

  isCardIllegal(card: CardAdapter): boolean {
    return (
      this.deckValidation?.illegalCards.find((c) =>
        sameCardComparison(c, card)
      ) !== undefined
    );
  }

  isCardIllegalColors(card: CardAdapter): boolean {
    return (
      this.deckValidation?.illegalColorIdentities.find((c) =>
        sameCardComparison(c, card)
      ) !== undefined
    );
  }

  isCardInMissingCards(card: CardAdapter) {
    return (
      this.missingCards.filter(
        (c) => card.id === c.id && card.isFoil === c.isFoil
      ).length > 0
    );
  }

  dropCard(event: CdkDragDrop<CardAdapter[]>) {
    if (this.listType === LISTTYPES.WISHLIST) {
      moveItemInArray(
        this.dataSource.data,
        event.previousIndex,
        event.currentIndex
      );
      this.reapplyDatasource();
    }
  }

  compareCard(card1: CardAdapter | undefined, card2: CardAdapter | undefined) {
    return sameCardComparison(card1, card2);
  }

  currentShownData(): Array<CardAdapter> {
    return this.dataSource.filteredData
      .filter((u, i) => i >= this.paginator.pageSize * this.paginator.pageIndex)
      .filter((u, i) => i < this.paginator.pageSize);
  }
}
