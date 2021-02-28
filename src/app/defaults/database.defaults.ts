import { CURRENCY } from '../models/enums';

export const defaultDB = {
  hasBeenInitialized: false,
  name: '',
  owner: '',
  collection: [],
  wishlist: [],
  decks: [],
  networth: {
    value: 0.0,
    currency: CURRENCY.EUR,
    lastSync: new Date().getTime(),
  },
};

export const defaultNetworth = {
  value: 0.0,
  currency: CURRENCY.EUR,
  lastSync: new Date().getTime(),
};
