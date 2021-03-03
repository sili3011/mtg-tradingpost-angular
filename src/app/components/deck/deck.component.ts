import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Deck } from 'src/app/models/deck';
import { COLORS, FORMATS, LISTTYPES } from 'src/app/models/enums';
import { DecksStore } from 'src/app/stores/decks.store';

@Component({
  selector: 'mtg-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnInit, OnDestroy {
  ListTypes = LISTTYPES;

  formatArray = Object.keys(FORMATS)
    .map((key) => FORMATS[parseInt(key)])
    .filter((map) => map !== '' && map !== undefined);

  colorsArray = Object.keys(COLORS);

  deckId: string = '';
  deck!: Deck | undefined;

  settingsExpanded: boolean = false;

  subscriptions: Array<any> = [];

  constructor(private route: ActivatedRoute, private decksStore: DecksStore) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.deckId = params.id;
        this.deck = this.decksStore.decks.find((d) => d.id === this.deckId);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  toggleExpanded() {
    this.settingsExpanded = !this.settingsExpanded;
  }
}
