import { CardAdapter } from './card-adapter';
import { MANACOLORS, FORMATS } from './enums';

export interface Deck {
  id: string;
  name: string;
  cards: Array<CardAdapter>;
  format: FORMATS;
  playable: boolean;
  active: boolean;
  colors: MANACOLORS;
  sideboard: Array<CardAdapter>;
  commander?: CardAdapter;
  companion?: CardAdapter;
  boxArt?: string;
}
