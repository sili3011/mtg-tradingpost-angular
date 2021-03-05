import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Deck } from 'src/app/models/deck';
import { COLORS, FORMATS, LISTTYPES } from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';
import { DecksStore } from 'src/app/stores/decks.store';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'mtg-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnInit, OnDestroy {
  ListTypes = LISTTYPES;
  Colors = COLORS;

  formatArray = Object.keys(FORMATS)
    .map((key) => FORMATS[parseInt(key)])
    .filter((map) => map !== '' && map !== undefined);

  colorsArray = Object.keys(COLORS);

  deckId: string = '';
  deck!: Deck | undefined;

  settingsGroup: FormGroup;

  settingsExpanded: boolean = false;

  subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private decksStore: DecksStore,
    private dbService: DBService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.settingsGroup = this.fb.group({
      format: [this.deck && this.deck.format ? this.deck.format : FORMATS.NONE],
      colors: [this.deck && this.deck.colors ? this.deck.colors : COLORS.NONE],
      isActive: [this.deck && this.deck.active ? this.deck.active : false],
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe((params) => {
        this.deckId = params.id;
        this.deck = this.decksStore.decks.find((d) => d.id === this.deckId);
        this.settingsGroup.setValue({
          format: this.deck!.format ? this.deck!.format : FORMATS.NONE,
          colors: this.deck!.colors ? this.deck!.colors : COLORS.NONE,
          isActive: this.deck!.active ? this.deck!.active : false,
        });
      })
    );

    this.subscriptions.add(
      this.settingsGroup.valueChanges.subscribe((value) => {
        this.deck!.format = value.format;
        this.deck!.colors = value.colors;
        this.deck!.active = value.isActive;
        this.dbService.setDeck(this.deck!);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleExpanded() {
    this.settingsExpanded = !this.settingsExpanded;
  }

  removeDeck() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Confirm deleting ' + this.deck!.name },
    });
    this.subscriptions.add(
      ref.afterClosed().subscribe(() => {
        if (ref.componentInstance.confirmed) {
          this.dbService.removeDeck(this.deck!);
        }
      })
    );
  }
}
