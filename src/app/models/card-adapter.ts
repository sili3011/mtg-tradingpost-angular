import { Card } from 'scryfall-sdk';

export interface CardAdapter extends Card {
  amount: number | 0;
  isFoil: boolean;
}
