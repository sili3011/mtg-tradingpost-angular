import { CardAdapter } from './card-adapter';
import { DECKTYPES } from './enums';

export interface Deck {
  id: string;
  name: string;
  cards: Array<CardAdapter>;
  type: DECKTYPES;
  playable: boolean;
  active: boolean;
  colors: string;
}
