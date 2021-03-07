import { FORMATS } from './enums';

export interface Format {
  format: FORMATS;
  minCardAmount: number;
  hasCommander: boolean;
  sideboardMaxCardAmount: number;
}

export const Formats: Array<Format> = [
  {
    format: FORMATS.STANDARD,
    minCardAmount: 60,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
  },
  {
    format: FORMATS.MODERN,
    minCardAmount: 60,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
  },
  {
    format: FORMATS.LEGACY,
    minCardAmount: 60,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
  },
  {
    format: FORMATS.VINTAGE,
    minCardAmount: 60,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
  },
  {
    format: FORMATS.BLOCK,
    minCardAmount: 60,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
  },
  {
    format: FORMATS.PIONEER,
    minCardAmount: 60,
    hasCommander: false,
    sideboardMaxCardAmount: 15,
  },
  {
    format: FORMATS.COMMANDER,
    minCardAmount: 100,
    hasCommander: true,
    sideboardMaxCardAmount: 10,
  },
  {
    format: FORMATS.BRAWL,
    minCardAmount: 60,
    hasCommander: true,
    sideboardMaxCardAmount: 15,
  },
];
