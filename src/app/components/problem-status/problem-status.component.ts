import { Component, Input } from '@angular/core';
import { CardAdapter } from 'src/app/models/card-adapter';
import { Format, Formats } from 'src/app/models/constants';
import { Deck } from 'src/app/models/deck';
import { defaultDeck, defaultDeckValidation } from 'src/app/models/defaults';
import { FORMATS } from 'src/app/models/enums';
import {
  amountOfCardsInDeck,
  DeckValidation,
  problemsToHTMLList,
} from 'src/app/utils/utils';

@Component({
  selector: 'mtg-problem-status',
  templateUrl: './problem-status.component.html',
  styleUrls: ['./problem-status.component.scss'],
})
export class ProblemStatusComponent {
  @Input()
  showProblemsOnly = false;

  @Input()
  deck: Deck = defaultDeck;

  @Input()
  deckValidation: DeckValidation = defaultDeckValidation;

  @Input()
  currentFormat: Format = Formats.find((f) => f.format === FORMATS.STANDARD)!;

  @Input()
  missingCards: Array<CardAdapter> = [];

  formatArray = Object.keys(FORMATS)
    .map((key) => FORMATS[parseInt(key)])
    .filter((map) => map !== '' && map !== undefined);

  cardsListToHTMLList(cards: Array<CardAdapter>) {
    let ret = '';
    cards.forEach((card) => (ret += `<div>${card.name}</div>`));
    return ret;
  }

  amountOfCardsInDeck(deck: Deck): number {
    return amountOfCardsInDeck(deck);
  }

  getAmountOfProblems() {
    return this.missingCards.length > 0
      ? this.deckValidation.amountOfProblems + 1
      : this.deckValidation.amountOfProblems;
  }

  problemsToHTMLList() {
    return problemsToHTMLList(
      this.deckValidation,
      this.deck!,
      this.currentFormat,
      this.formatArray[this.currentFormat?.format],
      this.missingCards.length
    );
  }
}
