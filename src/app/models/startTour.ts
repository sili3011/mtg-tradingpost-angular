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
    private guidedTourService: GuidedTourService
  ) {}

  startTour(): void {
    if (this.router.url !== '/dashboard') {
      this.router.navigate([`/dashboard`]);
    }
    this.guidedTourService.startTour(this.tour);
    window.dispatchEvent(new Event('resize'));
  }

  steps: Array<TourStep> = [
    {
      title: 'Greetings!',
      content:
        'We detected that this is your first visit! Mind going on a short tour with us?',
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
      content: 'These are settings.',
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
        'You already know this if you didnt create an account. If you are using this online you can safely ignore this.',
      orientation: Orientation.Top,
      highlightPadding: 15,
    },
    {
      selector: '.backup',
      title: 'Backup your data',
      content:
        'You can download your data as a JSON to back it up locally. Essential if you are working without an account useful but not necassary if you have an account.',
      orientation: Orientation.Top,
      highlightPadding: 10,
    },
  ];

  tour: GuidedTour = {
    tourId: 'starter',
    useOrb: false,
    steps: this.steps,
  };
}
