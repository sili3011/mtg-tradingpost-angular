import { Component, Input } from '@angular/core';
import keyrune from './set.scss';

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

  sets: any = [];
  rarities: Array<string> = [];

  sizes = [`2x`, `3x`, `4x`, `5x`, `6x`];

  constructor() {
    let data = keyrune.split('{');
    this.sets = this.dataSanitizer(data[1]);
    this.rarities = this.dataSanitizer(data[2]);
    console.log(this.sets);
  }

  dataSanitizer(data: string): Array<string> {
    return data
      .split('[')
      .pop()!
      .split(']')[0]
      .split(' ')
      .map((d) => d.substring(1, d.length - 1));
  }

  checkRarity(rar: string): boolean {
    return (
      this.rarities.includes(rar) ||
      this.rarities.some((r) => r.startsWith(rar))
    );
  }

  getRarity(rar: string): string | undefined {
    return this.rarities.find((r) => r === rar || r.startsWith(rar));
  }

  render() {
    let classes = 'ss ';

    classes += this.sets.includes(this.set) ? [`ss-${this.set} `] : '';
    classes += this.sizes.includes(this.size) ? [`ss-${this.size} `] : '';
    classes += this.fixed ? 'ss-fw ' : '';
    classes += this.checkRarity(this.rarity)
      ? [`ss-${this.getRarity(this.rarity)} `]
      : '';
    classes += this.gradient || this.foil ? 'ss-grad ' : '';
    classes += this.foil ? 'ss-foil ' : '';

    return `<i title=${this.set} alt=${this.set} aria-hidden class="${classes}"></i>`;
  }
}
