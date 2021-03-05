import { COLORS, CURRENCIES, FORMATS } from '../models/enums';
import { v4 as uuidv4 } from 'uuid';

export const defaultDB = {
  hasBeenInitialized: false,
  name: '',
  owner: '',
  collection: [],
  wishlist: [],
  decks: [],
  networth: {
    value: 0.0,
    currency: CURRENCIES.EUR,
    lastSync: new Date().getTime(),
  },
};

export const defaultNetworth = {
  value: 0.0,
  currency: CURRENCIES.EUR,
  lastSync: new Date().getTime(),
};

export const defaultDeck = {
  id: uuidv4(),
  name: '',
  cards: [],
  format: FORMATS.NONE,
  playable: false,
  active: true,
  colors: COLORS.NONE,
};
