import { GuidedTour, Orientation, TourStep } from 'ngx-guided-tour';
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

const steps: Array<TourStep> = [
  {
    title: 'Greetings!',
    content:
      'We detected that this is your first visit! Mind to go on a short tour with us?',
  },
  {
    selector: '.dashboard',
    title: 'Dashboard',
    content:
      'This is the center of operations, you can go everywhere from here.',
    orientation: Orientation.Center,
  },
  {
    selector: '.to-dashboard',
    title: 'Coming back',
    content:
      'You can get back to the dashboard from anywhere by clicking on the mtg-tradingpost logo.',
    orientation: Orientation.Bottom,
  },
  {
    selector: '.settings',
    title: 'Settings!',
    content: 'Lets start with the settings.',
    orientation: Orientation.TopLeft,
  },
];

export const tour: GuidedTour = {
  tourId: 'starter',
  useOrb: false,
  steps: steps,
};
