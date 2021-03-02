import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Cards } from 'scryfall-sdk';
import { CardAdapter } from 'src/app/models/card-adapter';
import { LISTTYPES } from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';

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

  constructor(
    private dialogRef: MatDialogRef<AddCardDialogComponent>,
    private dbService: DBService,
    @Inject(MAT_DIALOG_DATA) public listType: LISTTYPES
  ) {}

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
        // deal with error
        throw new Error('Bad Request');
      }
    });
  }

  getSelectedPrintPic() {
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

  printSelect(print: CardAdapter) {
    if (this.selectedPrint !== print) {
      this.selectedPrint = print;
    }
  }

  get input() {
    return this.searchControl.value?.trim();
  }

  close() {
    this.dialogRef.close();
  }

  addCard() {
    this.dbService.addCard(this.selectedPrint!, this.listType);
    this.close();
  }
}
