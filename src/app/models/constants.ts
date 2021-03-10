import { FORMATS } from './enums';

export interface Format {
  format: FORMATS;
  name: string;
  minCardAmount: number;
  hasCommander: boolean;
  sideboardMaxCardAmount: number;
}

export const Formats: Array<Format> = [
  {
    format: FORMATS.STANDARD,
    name: 'standard',
    minCardAmount: 60,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
  },
  {
    format: FORMATS.MODERN,
    name: 'modern',
    minCardAmount: 60,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
  },
  {
    format: FORMATS.LEGACY,
    name: 'legacy',
    minCardAmount: 60,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
  },
  {
    format: FORMATS.VINTAGE,
    name: 'vintage',
    minCardAmount: 60,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
  },
  {
    format: FORMATS.PIONEER,
    name: 'pioneer',
    minCardAmount: 60,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
  },
  {
    format: FORMATS.COMMANDER,
    name: 'commander',
    minCardAmount: 100,
    hasCommander: true,
    sideboardMaxCardAmount: 10,
  },
  {
    format: FORMATS.BRAWL,
    name: 'brawl',
    minCardAmount: 60,
    hasCommander: true,
    sideboardMaxCardAmount: 15,
  },
];
