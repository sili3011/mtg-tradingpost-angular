import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { CardAdapter } from 'src/app/models/card-adapter';
import { Format, Formats } from 'src/app/models/constants';
import { Deck } from 'src/app/models/deck';
import { defaultDeck } from 'src/app/models/defaults';
import { COLORHEXES, FORMATS, MANACOLORS } from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';
import { CardsStore } from 'src/app/stores/cards.store';
import { DecksStore } from 'src/app/stores/decks.store';
import { DeckValidation, validateDeck } from 'src/app/utils/utils';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'mtg-deck-management',
  templateUrl: './deck-management.component.html',
  styleUrls: ['./deck-management.component.scss'],
})
export class DeckManagementComponent implements OnInit, OnDestroy {
  decks: Array<Deck> = [];

  hoveredDeckId = '';

  disposer: IReactionDisposer;

  constructor(
    private router: Router,
    private decksStore: DecksStore,
    private cardsStore: CardsStore,
    private dbService: DBService,
    private dialog: MatDialog
  ) {
    this.disposer = autorun(() => {
      this.decks = this.decksStore.decks;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.disposer();
  }

  removeDeck(deck: Deck, $event: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Confirm deleting ' + deck.name },
    });
    ref.afterClosed().subscribe(() => {
      if (ref.componentInstance.confirmed) {
        this.router.navigate([`/decks`]);
        this.dbService.removeDeck(deck);
      }
    });
    $event.stopPropagation();
  }

  getColorHexes(identity: MANACOLORS): string {
    const colors = Object.values(MANACOLORS)[
      Object.keys(MANACOLORS).indexOf(identity)
    ];
    let color = `linear-gradient(60deg, COLORS)`;
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
        color = color.replace(
          'COLORS',
          `${COLORHEXES.WHITE} 50%, ${COLORHEXES.BLUE} 50%`
        );
        break;
      case MANACOLORS.ORZOV:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.WHITE} 50%, ${COLORHEXES.BLACK} 50%`
        );
        break;
      case MANACOLORS.DIMIR:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.BLUE} 50%, ${COLORHEXES.BLACK} 50%`
        );
        break;
      case MANACOLORS.IZZET:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.RED} 50%, ${COLORHEXES.BLUE} 50%`
        );
        break;
      case MANACOLORS.GOLGARI:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.GREEN} 50%, ${COLORHEXES.BLACK} 50%`
        );
        break;
      case MANACOLORS.RAKDOS:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.RED} 50%, ${COLORHEXES.BLACK} 50%`
        );
        break;
      case MANACOLORS.BOROS:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.WHITE} 50%, ${COLORHEXES.RED} 50%`
        );
        break;
      case MANACOLORS.GRUUL:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.GREEN} 50%, ${COLORHEXES.RED} 50%`
        );
        break;
      case MANACOLORS.SIMMIC:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.BLUE} 50%, ${COLORHEXES.GREEN} 50%`
        );
        break;
      case MANACOLORS.SELESNYA:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.WHITE} 50%, ${COLORHEXES.GREEN} 50%`
        );
        break;
      case MANACOLORS.BANT:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.WHITE} 33%, ${COLORHEXES.BLUE} 33%, ${COLORHEXES.BLUE} 66%, ${COLORHEXES.GREEN} 66%`
        );
        break;
      case MANACOLORS.ESPER:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.BLUE} 33%, ${COLORHEXES.BLACK} 33%, ${COLORHEXES.BLACK} 66% ${COLORHEXES.WHITE} 66%`
        );
        break;
      case MANACOLORS.GRIXIS:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.BLACK} 33%, ${COLORHEXES.RED} 33%, ${COLORHEXES.RED} 66%, ${COLORHEXES.BLUE} 66%`
        );
        break;
      case MANACOLORS.JUND:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.RED} 33%, ${COLORHEXES.GREEN} 33%, ${COLORHEXES.GREEN} 66%, ${COLORHEXES.BLACK} 66%`
        );
        break;
      case MANACOLORS.NAYA:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.GREEN} 33%, ${COLORHEXES.WHITE} 33%, ${COLORHEXES.WHITE} 66%, ${COLORHEXES.RED} 66%`
        );
        break;
      case MANACOLORS.ABZAN:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.WHITE} 33%, ${COLORHEXES.BLACK} 33%, ${COLORHEXES.BLACK} 66%, ${COLORHEXES.GREEN} 66%`
        );
        break;
      case MANACOLORS.JESKAI:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.BLUE} 33%, ${COLORHEXES.RED} 33%, ${COLORHEXES.RED} 66%, ${COLORHEXES.WHITE} 66%`
        );
        break;
      case MANACOLORS.SULTAI:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.BLACK} 33%, ${COLORHEXES.GREEN} 33%, ${COLORHEXES.GREEN} 66%, ${COLORHEXES.BLUE} 66%`
        );
        break;
      case MANACOLORS.MARDU:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.RED} 33%, ${COLORHEXES.WHITE} 33%, ${COLORHEXES.WHITE} 66%, ${COLORHEXES.BLACK} 66%`
        );
        break;
      case MANACOLORS.TEMUR:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.GREEN} 33%, ${COLORHEXES.BLUE} 33%, ${COLORHEXES.BLUE} 66%, ${COLORHEXES.RED} 66%`
        );
        break;
      case MANACOLORS.UBRG:
        color = color.replace(
          'COLORS',
          `${COLORHEXES.BLUE} 25%, ${COLORHEXES.BLACK} 25%, ${COLORHEXES.BLACK} 50%, ${COLORHEXES.RED} 50%, ${COLORHEXES.RED} 75%, ${COLORHEXES.GREEN} 75%`
        );
        break;
      case MANACOLORS.BRGW:
        color = color
          .replace(
            'COLORS',
            `${COLORHEXES.BLACK} 25%, ${COLORHEXES.RED} 25%, ${COLORHEXES.RED} 50%, ${COLORHEXES.GREEN} 50%, ${COLORHEXES.GREEN} 75%, ${COLORHEXES.WHITE} 75%`
          )
          .replace('60', '70');
        break;
      case MANACOLORS.RGWU:
        color = color
          .replace(
            'COLORS',
            `${COLORHEXES.RED} 25%, ${COLORHEXES.GREEN} 25%, ${COLORHEXES.GREEN} 50%, ${COLORHEXES.WHITE} 50%, ${COLORHEXES.WHITE} 75%, ${COLORHEXES.BLUE} 75%`
          )
          .replace('60', '70');
        break;
      case MANACOLORS.RGWU:
        color = color
          .replace(
            'COLORS',
            `${COLORHEXES.GREEN} 25%, ${COLORHEXES.WHITE} 25%, ${COLORHEXES.WHITE} 50%, ${COLORHEXES.BLUE} 50%, ${COLORHEXES.BLUE} 75% ${COLORHEXES.BLACK} 75%`
          )
          .replace('60', '70');
        break;
      case MANACOLORS.WUBR:
        color = color
          .replace(
            'COLORS',
            `${COLORHEXES.WHITE} 25%, ${COLORHEXES.BLUE} 25%, ${COLORHEXES.BLUE} 50%, ${COLORHEXES.BLACK} 50%, ${COLORHEXES.BLACK} 75%, ${COLORHEXES.RED} 75%`
          )
          .replace('60', '70');
        break;
      case MANACOLORS.WUBRG:
        color = color
          .replace(
            'COLORS',
            `${COLORHEXES.WHITE} 20%, ${COLORHEXES.BLUE} 20%, ${COLORHEXES.BLUE} 40%, ${COLORHEXES.BLACK} 40%, ${COLORHEXES.BLACK} 60%, ${COLORHEXES.RED} 60%, ${COLORHEXES.RED} 80%, ${COLORHEXES.GREEN} 80%`
          )
          .replace('60', '75');
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

  getFormat(deck: Deck): Format {
    return Formats.find(
      (f) => Object.values(FORMATS)[f.format] === deck.format
    )!;
  }

  validate(deck: Deck): DeckValidation {
    return validateDeck(deck, this.getFormat(deck));
  }

  missingCards(deck: Deck): Array<CardAdapter> {
    return this.cardsStore.missingCards.filter((c) =>
      deck.cards
        .map((card) => [card.id, card.isFoil])
        .includes([c.id, c.isFoil])
    );
  }
}
