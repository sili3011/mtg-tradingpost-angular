import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Cards } from 'scryfall-sdk';
import { CardAdapter } from 'src/app/models/card-adapter';
import { CURRENCIES, LISTTYPES } from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';
import { CardsStore } from 'src/app/stores/cards.store';

@Component({
  selector: 'mtg-add-card-dialog',
  templateUrl: './add-card-dialog.component.html',
  styleUrls: ['./add-card-dialog.component.scss'],
})
export class AddCardDialogComponent implements OnInit, OnDestroy {
  searchControl = new FormControl();
  autoCompleteCatalogue: Array<any> = [];
  otherPrints: Array<any> = [];
  selectedPrint: any;
  loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  lastPicLoaded = 'assets/mtg-cardback.jpg';

  amount: number = 1;
  isFoil: boolean = false;
  alsoAddToCollection: boolean = false;

  subscriptions: Subscription = new Subscription();

  listtypes = LISTTYPES;

  constructor(
    private dialogRef: MatDialogRef<AddCardDialogComponent>,
    private dbService: DBService,
    private cardsStore: CardsStore,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.searchControl.valueChanges.subscribe(() => {
        this.loaded.next(false);
        this.debouncedAutocomplete();
      })
    );
    this.subscriptions.add(
      this.loaded.subscribe((loaded) => {
        const flip = document.body.getElementsByClassName(
          'dialog-flip-card-inner'
        )[0];
        loaded
          ? flip.classList.add('animated')
          : flip.classList.remove('animated');
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  debouncedAutocomplete = _.debounce(async () => {
    this.autoCompleteCatalogue = await Cards.autoCompleteName(this.input);
  }, 200);

  onEnter(): void {
    this.onSelect(this.input);
  }

  onSelect(option: string): void {
    this.selectedPrint = undefined;
    this.otherPrints = [];
    this.loaded.next(false);
    Cards.byName(option).then((_) => {
      if (_.object === 'card') {
        this.selectedPrint = _;
        Cards.query(
          _.prints_search_uri.replace('https://api.scryfall.com/', '')
        ).then((__: any) => (this.otherPrints = __.data));
        this.loaded.next(true);
      } else {
        throw new Error('Bad Request');
      }
    });
  }

  getSelectedPrintPic(): string {
    if (this.selectedPrint) {
      if (this.selectedPrint.image_uris) {
        this.lastPicLoaded = this.selectedPrint.image_uris.normal;
      } else {
        this.lastPicLoaded = this.selectedPrint.card_faces[0].image_uris.normal; // MULTI FACED CARDS | TODO: show both sides?
      }
      return this.lastPicLoaded;
    }
    return this.lastPicLoaded;
  }

  printSelect(print: CardAdapter): void {
    if (this.selectedPrint !== print) {
      this.selectedPrint = print;
    }
  }

  get input(): string {
    return this.searchControl.value?.trim();
  }

  close(): void {
    this.dialogRef.close();
  }

  addCard(): void {
    this.dbService.addCard(
      this.selectedPrint!,
      this.data.listType,
      this.data.deckId,
      this.amount,
      this.isFoil
    );
    if (this.alsoAddToCollection) {
      this.dbService.addCard(
        this.selectedPrint!,
        this.listtypes.COLLECTION,
        this.data.deckId,
        this.amount,
        this.isFoil
      );
    }
    this.selectedPrint = undefined;
    this.otherPrints = [];
    this.searchControl.setValue('');
    this.amount = 1;
    this.isFoil = false;
  }

  increment(): void {
    ++this.amount;
  }

  decrement(): void {
    if (this.amount > 1) {
      --this.amount;
    }
  }

  toggleFoil(): void {
    this.isFoil = !this.isFoil;
  }

  toggleAlsoAddToCollection(): void {
    this.alsoAddToCollection = !this.alsoAddToCollection;
  }

  priceOfPrint(): string | undefined {
    switch (this.cardsStore.networth.currency) {
      case CURRENCIES.EUR:
        return isNaN(parseFloat(this.selectedPrint.prices.eur))
          ? undefined
          : parseFloat(this.selectedPrint.prices.eur) + ' €';
      case CURRENCIES.USD:
        return isNaN(parseFloat(this.selectedPrint.prices.usd))
          ? undefined
          : parseFloat(this.selectedPrint.prices.usd) + ' $';
      default:
        return '';
    }
  }
}
