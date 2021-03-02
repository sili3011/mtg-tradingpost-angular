import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Cards } from 'scryfall-sdk';
import { CardAdapter } from 'src/app/models/card-adapter';

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

  subscriptions: Array<any> = [];

  constructor() {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.searchControl.valueChanges.subscribe(async () => {
        this.loaded.next(false);
        this.autoCompleteCatalogue = await Cards.autoCompleteName(this.input);
      })
    );
    this.subscriptions.push(
      this.loaded.subscribe((loaded) => {
        const flip = document.body.getElementsByClassName('flip-card-inner')[0];
        loaded
          ? flip.classList.add('animated')
          : flip.classList.remove('animated');
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe);
  }

  onEnter() {
    this.onSelect(this.input);
  }

  onSelect(option: string) {
    this.selectedPrint = null;
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
        // deal with error
        throw new Error('Bad Request');
      }
    });
  }

  getSelectedPrintPic() {
    if (this.selectedPrint) {
      this.lastPicLoaded = this.selectedPrint.image_uris!.normal;
      return this.lastPicLoaded;
    }
    return this.lastPicLoaded;
  }

  printSelect(print: CardAdapter) {
    if (this.selectedPrint !== print) {
      this.selectedPrint = print;
    }
  }

  get input() {
    return this.searchControl.value?.trim();
  }
}
