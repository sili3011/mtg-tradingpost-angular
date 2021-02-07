import {
  trigger,
  state,
  style,
  transition,
  animate,
  animateChild,
  query,
} from '@angular/animations';

export const onSideNavChange = trigger('onSideNavChange', [
  state(
    'close',
    style({
      'min-width': '50px',
    })
  ),
  state(
    'open',
    style({
      'min-width': '250px',
    })
  ),
  transition('close => open', animate('150ms ease-in')),
  transition('open => close', animate('350ms ease-in')),
]);

export const onMainContentChange = trigger('onMainContentChange', [
  state(
    'close',
    style({
      'margin-left': '50px',
    })
  ),
  state(
    'open',
    style({
      'margin-left': '50px',
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);

export const animateText = trigger('animateText', [
  state(
    'hide',
    style({
      display: 'none',
      opacity: 0,
    })
  ),
  state(
    'show',
    style({
      display: 'block',
      opacity: 1,
    })
  ),
  transition('close => open', animate('100ms ease-in')),
  transition('open => close', animate('100ms ease-out')),
]);
