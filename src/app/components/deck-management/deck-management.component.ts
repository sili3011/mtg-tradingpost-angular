import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Deck } from 'src/app/models/deck';
import { defaultDeck } from 'src/app/models/defaults';
import { COLORHEXES, MANACOLORS } from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';
import { DecksStore } from 'src/app/stores/decks.store';

@Component({
  selector: 'mtg-deck-management',
  templateUrl: './deck-management.component.html',
  styleUrls: ['./deck-management.component.scss'],
})
export class DeckManagementComponent implements OnInit, OnDestroy {
  decks: Array<Deck> = [];

  disposer: IReactionDisposer;

  constructor(
    private router: Router,
    private decksStore: DecksStore,
    private dbService: DBService
  ) {
    this.disposer = autorun(() => {
      this.decks = this.decksStore.decks;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.disposer();
  }

  getColorHexes(identity: MANACOLORS): string {
    const colors = Object.values(MANACOLORS)[
      Object.keys(MANACOLORS).indexOf(identity)
    ];
    let color = `linear-gradient(60deg, ONE 50%, TWO 50%)`;
    switch (colors) {
      case MANACOLORS.NONE:
        color = '';
        break;
      case MANACOLORS.GREEN:
        color = COLORHEXES.GREEN;
        break;
      case MANACOLORS.WHITE:
        color = COLORHEXES.WHITE;
        break;
      case MANACOLORS.RED:
        color = COLORHEXES.RED;
        break;
      case MANACOLORS.BLUE:
        color = COLORHEXES.BLUE;
        break;
      case MANACOLORS.BLACK:
        color = COLORHEXES.BLACK;
        break;
      case MANACOLORS.AZORIUS:
        color = color
          .replace('ONE', COLORHEXES.WHITE)
          .replace('TWO', COLORHEXES.BLUE);
        break;
      case MANACOLORS.ORZOV:
        color = color
          .replace('ONE', COLORHEXES.WHITE)
          .replace('TWO', COLORHEXES.BLACK);
        break;
      case MANACOLORS.DIMIR:
        color = color
          .replace('ONE', COLORHEXES.BLUE)
          .replace('TWO', COLORHEXES.BLACK);
        break;
      case MANACOLORS.IZZET:
        color = color
          .replace('ONE', COLORHEXES.RED)
          .replace('TWO', COLORHEXES.BLUE);
        break;
      case MANACOLORS.GOLGARI:
        color = color
          .replace('ONE', COLORHEXES.GREEN)
          .replace('TWO', COLORHEXES.BLACK);
        break;
      case MANACOLORS.RAKDOS:
        color = color
          .replace('ONE', COLORHEXES.RED)
          .replace('TWO', COLORHEXES.BLACK);
        break;
      case MANACOLORS.BOROS:
        color = color
          .replace('ONE', COLORHEXES.WHITE)
          .replace('TWO', COLORHEXES.RED);
        break;
      case MANACOLORS.GRUUL:
        color = color
          .replace('ONE', COLORHEXES.GREEN)
          .replace('TWO', COLORHEXES.RED);
        break;
      case MANACOLORS.SIMMIC:
        color = color
          .replace('ONE', COLORHEXES.BLUE)
          .replace('TWO', COLORHEXES.GREEN);
        break;
      case MANACOLORS.SELESNYA:
        color = color
          .replace('ONE', COLORHEXES.WHITE)
          .replace('TWO', COLORHEXES.GREEN);
        break;
      default:
        throw new Error(
          'Error: colors for color identity ' +
            identity +
            ' ' +
            colors +
            ' need to be implemented!'
        );
    }
    return color;
  }

  goto(deck: Deck) {
    this.router.navigate([`/deck/${deck.id}`]);
  }

  addDeck() {
    this.dbService.addDeck(defaultDeck);
  }
}