import { Router } from '@angular/router';
import {
  TourStep,
  Orientation,
  GuidedTour,
  GuidedTourService,
} from 'ngx-guided-tour';

export default class StartTour {
  constructor(
    private router: Router,
    private guidedTourService: GuidedTourService,
    firstTime: boolean = false
  ) {
    if (firstTime) {
      this.steps[0] = {
        title: 'Greetings!',
        content:
          'We detected that this is your first visit! Mind going on a short tour with us?',
      };
    }
  }

  startTour(): void {
    if (this.router.url !== '/dashboard') {
      this.router.navigate([`/dashboard`]);
    }
    this.guidedTourService.startTour(this.tour);
    window.dispatchEvent(new Event('resize'));
  }

  steps: Array<TourStep> = [
    {
      title: 'Welcome back!',
      content: 'Let´s see if we can help you remember how this works.',
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
      selector: '.sidenav_container',
      title: 'Get somewhere',
      content:
        'This is the sidenav. If you are anywhere but the dashboard, this is your only way to get around (also if you are on the dashboard of course).',
      orientation: Orientation.Right,
    },
    {
      selector: '.to-settings',
      title: 'Settings!',
      content: 'Lets start with the settings.',
      orientation: Orientation.TopLeft,
      closeAction: () => {
        this.router.navigate([`/settings`]);
      },
    },
    {
      title: 'Settings!',
      content:
        'Here reside your personal preferences and the database management for everyone without an account. Next will be the collection at step 12.',
    },
    {
      selector: '.preferences',
      title: 'Preferences',
      content: 'These are your personal preferences.',
      orientation: Orientation.Bottom,
      highlightPadding: 15,
    },
    {
      selector: '.database',
      title: 'Database management',
      content:
        'You already know this if you didnt create an account. If you are using the app with an account you can safely ignore this.',
      orientation: Orientation.Top,
      highlightPadding: 15,
    },
    {
      selector: '.backup',
      title: 'Backup your data',
      content:
        'You can download your data as a JSON to back it up locally. Essential if you are working without an account, useful but not necassary if you have an account.',
      orientation: Orientation.Top,
      highlightPadding: 10,
    },
    {
      selector: '.give-feedback',
      title: 'Feedback / Report bug',
      content:
        'If you have any suggestions and/or wanna report a bug, you can find a form for that here.',
      orientation: Orientation.Top,
      highlightPadding: 10,
    },
    {
      selector: '.restart-tour',
      title: 'Restart the fun',
      content:
        'If you ever get lost, or forget how something works, come back here to get taught again.',
      orientation: Orientation.Top,
      highlightPadding: 10,
    },
    {
      selector: '.to-collection',
      title: 'Collect!',
      content: 'Let´s start collecting some cards, shall we?',
      orientation: Orientation.Right,
      closeAction: () => {
        this.router.navigate([`/collection`]);
      },
    },
    {
      title: 'Your collection',
      content:
        'The collection represents the whole of the cards you own. You see them here in a pretty self-explanatory list that will appear in different modules of this app aswell. Let´s go over some details.',
    },
    {
      selector: '.add-card',
      title: 'Adding cards',
      content:
        'Let´s start by adding a card, so we can see what it looks like.',
      orientation: Orientation.Bottom,
      closeAction: () => {
        this.router.navigate([`/collection`]);
      },
    },
  ];

  tour: GuidedTour = {
    tourId: 'starter',
    useOrb: false,
    steps: this.steps,
  };
}
