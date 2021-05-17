import { FORMATS } from './enums';

export interface Format {
  format: FORMATS;
  name: string;
  minCardAmount: number;
  maxCopiesOfCards: number;
  hasCommander: boolean;
  sideboardMaxCardAmount: number;
  mustComplyToColorIdentity: boolean;
}

export const Formats: Array<Format> = [
  {
    format: FORMATS.STANDARD,
    name: 'standard',
    minCardAmount: 60,
    maxCopiesOfCards: 4,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
    mustComplyToColorIdentity: false,
  },
  {
    format: FORMATS.MODERN,
    name: 'modern',
    minCardAmount: 60,
    maxCopiesOfCards: 4,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
    mustComplyToColorIdentity: false,
  },
  {
    format: FORMATS.LEGACY,
    name: 'legacy',
    minCardAmount: 60,
    maxCopiesOfCards: 4,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
    mustComplyToColorIdentity: false,
  },
  {
    format: FORMATS.VINTAGE,
    name: 'vintage',
    minCardAmount: 60,
    maxCopiesOfCards: 4,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
    mustComplyToColorIdentity: false,
  },
  {
    format: FORMATS.PIONEER,
    name: 'pioneer',
    minCardAmount: 60,
    maxCopiesOfCards: 4,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
    mustComplyToColorIdentity: false,
  },
  {
    format: FORMATS.COMMANDER,
    name: 'commander',
    minCardAmount: 100,
    maxCopiesOfCards: 1,
    hasCommander: true,
    sideboardMaxCardAmount: 0,
    mustComplyToColorIdentity: true,
  },
  {
    format: FORMATS.BRAWL,
    name: 'brawl',
    minCardAmount: 60,
    maxCopiesOfCards: 1,
    hasCommander: true,
    sideboardMaxCardAmount: 0,
    mustComplyToColorIdentity: true,
  },
];
