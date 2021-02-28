import { Component, Input } from '@angular/core';

@Component({
  selector: 'mtg-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.scss'],
})
export class SetComponent {
  @Input()
  set: string = '';
  @Input()
  size: string = '';
  @Input()
  fixed: boolean = false;
  @Input()
  rarity: string = '';
  @Input()
  gradient: boolean = false;
  @Input()
  foil: boolean = false;

  constructor() {}

  render() {}
}
