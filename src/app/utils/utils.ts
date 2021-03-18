import { ImageUris } from 'scryfall-sdk';
import { CardAdapter } from '../models/card-adapter';
import { Format } from '../models/constants';
import { Deck } from '../models/deck';
import { defaultDeckValidation } from '../models/defaults';
import { COLORS, FORMATS, MANACOLORS } from '../models/enums';

export function imageTooltip(image: ImageUris, type: 'normal' | 'art'): string {
  switch (type) {
    case 'normal':
      return `<img src="${image.normal}" style="border-radius: 25px;">`;
    case 'art':
      return `<img src="${image.art_crop}" style="border-radius: 25px;">`;
  }
}

export function amountOfCardsOfDeck(deck: Deck): number {
  let cardsCount = 0;
  deck.cards.forEach((card) => (cardsCount += card.amount));
  if (deck.companion) {
    --cardsCount;
  }
  return cardsCount;
}

export function deckToCurve(deck: Deck): Array<any> {
  const ret: any[] = [];
  deck.cards.forEach((card) => {
    if (
      card.type_line
        .split(' ')
        .find((t) => t.toLocaleLowerCase() === 'land') === undefined
    ) {
      let searchingFor = '';
      if (!card.color_identity[0]) {
        searchingFor = 'Colorless';
      } else if (card.color_identity.length > 1) {
        searchingFor = 'Multi';
      } else {
        searchingFor = card.color_identity[0];
      }
      let found = ret.find((r) => {
        if (r.name === searchingFor) {
          return true;
        }
        if (r.name.length !== card.color_identity.length) {
          return false;
        }
        for (let i = 0; i < r.name.length; i++) {
          if (r.name[i] !== card.color_identity[i]) {
            return false;
          }
        }
        return true;
      });
      if (!found) {
        found = {
          name: searchingFor,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: curveColor(card.color_identity),
        };
        ret.push(found);
      }
      if (card.cmc >= 9) {
        found.data[9] += card.amount;
      } else {
        found.data[card.cmc] += card.amount;
      }
    }
  });
  return ret;
}

function curveColor(color: Array<string>): string {
  if (color.length > 1) {
    return '#C9B47D';
  }
  switch (color[0]) {
    case 'G':
      return '#3d684b';
    case 'R':
      return '#c6553e';
    case 'B':
      return '#383431';
    case 'W':
      return '#ffffff';
    case 'U':
      return '#3b6ba0';
    default:
      return '#BEB9B2';
  }
}

export enum PIECHART {
  TYPES,
  COLORS,
}

export function deckToPie(
  deck: Deck,
  labels: Array<string>,
  type: PIECHART
): Array<number> {
  const ret: Array<number> = [];
  labels.forEach((label) => {
    if (type === PIECHART.TYPES) {
      ret.push(
        deck.cards.filter((card) =>
          card.type_line.toLowerCase().split(' ').includes(label.toLowerCase())
        ).length
      );
    }
    if (type === PIECHART.COLORS) {
      let amount = 0;
      if (label === COLORS.COLORLESS) {
        amount = deck.cards.filter(
          (card) => card.color_identity.join().toLowerCase() === ''
        ).length;
      } else if (label === COLORS.MULTI) {
        amount = deck.cards.filter((card) => card.color_identity.length > 1)
          .length;
      } else {
        let mana = '';
        switch (label) {
          case COLORS.GREEN:
            mana = 'g';
            break;
          case COLORS.RED:
            mana = 'r';
            break;
          case COLORS.BLACK:
            mana = 'b';
            break;
          case COLORS.BLUE:
            mana = 'u';
            break;
          case COLORS.WHITE:
            mana = 'w';
            break;
        }
        amount = deck.cards.filter(
          (card) =>
            card.color_identity.length === 1 &&
            card.color_identity.join().toLowerCase().includes(mana)
        ).length;
      }
      ret.push(amount);
    }
  });
  return ret;
}

export interface DeckValidation {
  amountOfProblems: number;
  hasLegalAmountOfCards: boolean;
  hasLegalAmountOfCopiesOfCards: boolean;
  hasNotMoreThanMaximumOfSideboardCards: boolean;
  hasNoIllegalCards: boolean;
  illegalCards: Array<CardAdapter>;
  hasNoIllegalColorIdentities: boolean;
  illegalColorIdentities: Array<CardAdapter>;
  needsCommander: boolean;
}

export function validateDeck(deck: Deck, format: Format): DeckValidation {
  let ret: DeckValidation = Object.assign({}, defaultDeckValidation);
  // VALIDATE CARD AMOUNT
  if (
    (format.format !== FORMATS.COMMANDER &&
      amountOfCardsOfDeck(deck) >= format.minCardAmount) ||
    (format.format === FORMATS.COMMANDER &&
      deck.cards.length === format.minCardAmount)
  ) {
    ret.hasLegalAmountOfCards = true;
    --ret.amountOfProblems;
  }
  // VALIDATE CARD COPIES
  let foundTooMany = false;
  deck.cards.forEach((c) => {
    if (c.amount > format.maxCopiesOfCards) {
      foundTooMany = true;
      return;
    }
  });
  if (!foundTooMany) {
    ret.hasLegalAmountOfCopiesOfCards = true;
    --ret.amountOfProblems;
  }
  // VALIDATE SIDEBOARD SIZE
  if (deck.sideboard.length <= format.minCardAmount) {
    ret.hasNotMoreThanMaximumOfSideboardCards = true;
    --ret.amountOfProblems;
  }
  // VALIDATE CARD LEGALITY
  ret.illegalCards = [];
  deck.cards.forEach((card) => {
    let legality = 'not_legal';
    switch (format.format) {
      case FORMATS.COMMANDER:
        legality = card.legalities['commander'];
        break;
      case FORMATS.DUEL:
        legality = card.legalities['duel'];
        break;
      case FORMATS.FUTURE:
        legality = card.legalities['future'];
        break;
      case FORMATS.HISTORIC:
        legality = card.legalities['historic'];
        break;
      case FORMATS.LEGACY:
        legality = card.legalities['legacy'];
        break;
      case FORMATS.MODERN:
        legality = card.legalities['modern'];
        break;
      case FORMATS.OLDSCHOOL:
        legality = card.legalities['oldschool'];
        break;
      case FORMATS.PAUPER:
        legality = card.legalities['pauper'];
        break;
      case FORMATS.PENNY:
        legality = card.legalities['penny'];
        break;
      case FORMATS.PIONEER:
        legality = card.legalities['pioneer'];
        break;
      case FORMATS.STANDARD:
        legality = card.legalities['standard'];
        break;
      case FORMATS.VINTAGE:
        legality = card.legalities['vintage'];
        break;
      default:
        legality = 'legal';
        break;
    }
    if (legality !== 'legal') {
      ret.illegalCards.push(card);
    }
  });
  deck.sideboard.forEach((card) => {
    let legality = 'not_legal';
    switch (format.format) {
      case FORMATS.COMMANDER:
        legality = card.legalities['commander'];
        break;
      case FORMATS.DUEL:
        legality = card.legalities['duel'];
        break;
      case FORMATS.FUTURE:
        legality = card.legalities['future'];
        break;
      case FORMATS.HISTORIC:
        legality = card.legalities['historic'];
        break;
      case FORMATS.LEGACY:
        legality = card.legalities['legacy'];
        break;
      case FORMATS.MODERN:
        legality = card.legalities['modern'];
        break;
      case FORMATS.OLDSCHOOL:
        legality = card.legalities['oldschool'];
        break;
      case FORMATS.PAUPER:
        legality = card.legalities['pauper'];
        break;
      case FORMATS.PENNY:
        legality = card.legalities['penny'];
        break;
      case FORMATS.PIONEER:
        legality = card.legalities['pioneer'];
        break;
      case FORMATS.STANDARD:
        legality = card.legalities['standard'];
        break;
      case FORMATS.VINTAGE:
        legality = card.legalities['vintage'];
        break;
      default:
        legality = 'legal';
        break;
    }
    if (legality !== 'legal') {
      ret.illegalCards.push(card);
    }
  });
  if (ret.illegalCards.length === 0) {
    ret.hasNoIllegalCards = true;
    --ret.amountOfProblems;
  }
  // VALIDATE COLOR IDENTITIES
  ret.illegalColorIdentities = [];
  if (format.mustComplyToColorIdentity) {
    deck.cards.forEach((card) => {
      card.color_identity.forEach((color) => {
        if (
          !MANACOLORS[
            (deck.colors as unknown) as keyof typeof MANACOLORS
          ].includes(color.toLowerCase())
        ) {
          ret.illegalColorIdentities.push(card);
          return;
        }
      });
    });
  }
  if (ret.illegalColorIdentities.length === 0) {
    ret.hasNoIllegalColorIdentities = true;
    --ret.amountOfProblems;
  }
  // VALIDATE COMMANDER
  if (format.hasCommander && !deck.commander) {
    ret.needsCommander = true;
    ++ret.amountOfProblems;
  }
  return ret;
}
