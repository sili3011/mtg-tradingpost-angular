import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MANACOLORS, FORMATS } from 'src/app/models/enums';

@Component({
  selector: 'mtg-mana',
  templateUrl: './mana.component.html',
  styleUrls: ['./mana.component.scss'],
})
export class ManaComponent implements OnChanges {
  @Input()
  symbol: string = '';
  @Input()
  size: string = '';
  @Input()
  cost: boolean = false;
  @Input()
  colorIndicator: boolean = false;
  @Input()
  shadow: boolean = false;
  @Input()
  half: boolean = false;
  @Input()
  fixed: boolean = false;
  @Input()
  loyalty: number | boolean = false;

  icons: any = Object.values(symbols).reduce(
    (hash, group) => ({ ...(hash as any), ...(group as any) }),
    {}
  );

  sizes = [`2x`, `3x`, `4x`, `5x`, `6x`];

  ngOnChanges(changes: SimpleChanges): void {
    const index = Object.keys(MANACOLORS).indexOf(changes.symbol.currentValue);

    if (index >= 0) {
      this.symbol = Object.values(MANACOLORS)[index];
    }

    this.render();
  }

  render() {
    let classes = 'ms ';

    classes +=
      !this.colorIndicator && Object.keys(this.icons).includes(this.symbol)
        ? [`ms-${this.symbol}`] + ' '
        : '';
    classes += this.sizes.includes(this.size) ? [`ms-${this.size}`] + ' ' : '';
    classes += this.cost ? 'ms-cost' + ' ' : '';
    classes += this.colorIndicator
      ? 'ms-ci' + ' ' + 'ms-ci-' + this.symbol + ' '
      : '';
    classes += this.shadow ? 'ms-shadow' + ' ' : '';
    classes += this.half ? 'ms-half' + ' ' : '';
    classes += this.fixed ? 'ms-fw' + ' ' : '';
    classes +=
      Object.keys(symbols[`Loyalty Symbols`]).includes(this.symbol) &&
      typeof this.loyalty === `number` &&
      this.loyalty >= 0 &&
      this.loyalty <= 20
        ? [`ms-loyalty-${this.loyalty}`] + ' '
        : '';

    return `<i title=${this.icons[this.symbol]} alt=${
      this.icons[this.symbol]
    } aria-hidden class="${classes}"></i>`;
  }
}

const symbols: any = {
  'Basic Mana': {
    w: `White`,
    u: `Blue`,
    b: `Black`,
    r: `Red`,
    g: `Green`,
    c: `Colorless Mana`,
    s: `Snow Mana`,
  },
  'Phyrexian Mana': {
    p: `Phyrexian Mana`,
    wp: `Phyrexian White`,
    up: `Phyrexian Blue`,
    bp: `Phyrexian Black`,
    rp: `Phyrexian Red`,
    gp: `Phyrexian Green`,
  },
  'Hybrid Mana': {
    wu: `White/Blue`,
    wb: `White/Black`,
    ub: `Blue/Black`,
    ur: `Blue/Red`,
    br: `Black/Red`,
    bg: `Black/Green`,
    rg: `Red/Green`,
    rw: `Red/White`,
    gw: `Green/White`,
    gu: `Green/Blue`,
    '2w': `2/White`,
    '2u': `2/Blue`,
    '2b': `2/Black`,
    '2r': `2/Red`,
    '2g': `2/Green`,
  },
  'Generic Mana': {
    0: `0`,
    1: `1`,
    2: `2`,
    3: `3`,
    4: `4`,
    5: `5`,
    6: `6`,
    7: `7`,
    8: `8`,
    9: `9`,
    10: `10`,
    11: `11`,
    12: `12`,
    13: `13`,
    14: `14`,
    15: `15`,
    16: `16`,
    17: `17`,
    18: `18`,
    19: `19`,
    20: `20`,
    x: `X`,
    y: `Y`,
    z: `Z`,
  },
  'Un-Symbols': {
    '100': `100`,
    '1000000': `1,000,000`,
    infinity: `Infinity`,
    '1-2': `1/2`,
  },
  Resources: {
    e: `Energy`,
  },
  'Loyalty Symbols': {
    'loyalty-up': `Loyalty Up`,
    'loyalty-down': `Loyalty Down`,
    'loyalty-zero': `Loyalty Zero`,
    'loyalty-start': `Loyalty Start`,
  },
  'Card Types': {
    artifact: `Artifact`,
    creature: `Creature`,
    enchantment: `Enchantment`,
    instant: `Instant`,
    land: `Land`,
    planeswalker: `Planeswalker`,
    sorcery: `Sorcery`,
    multiple: `Multiple`,
  },
  'Card Symbols': {
    tap: `Tap`,
    untap: `Untap`,
    'tap-alt': `Tap (Alt)`,
    flashback: `Flashback`,
    chaos: `Chaos`,
    power: `Power`,
    toughness: `Toughness`,
    'artist-brush': `Artist (Brush)`,
    'artist-nib': `Artist (Nib)`,
  },
  'Dual-Face Card Symbols': {
    'dfc-day': `DFC Day`,
    'dfc-night': `DFC Night`,
    'dfc-spark': `DFC Spark`,
    'dfc-ignite': `DFC Ignite`,
    'dfc-moon': `DFC Moon`,
    'dfc-emrakul': `DFC Emrakul`,
    'dfc-enchantment': `DFC Enchantment`,
  },
  'Guild and Clan Watermarks': {
    'guild-azorius': `Azorius`,
    'guild-boros': `Boros`,
    'guild-dimir': `Dimir`,
    'guild-golgari': `Golgari`,
    'guild-gruul': `Gruul`,
    'guild-izzet': `Izzet`,
    'guild-orzhov': `Orzhov`,
    'guild-rakdos': `Rakdos`,
    'guild-selesnya': `Selesnya`,
    'guild-simic': `Simic`,
    'clan-abzan': `Abzan`,
    'clan-jeskai': `Jeskai`,
    'clan-mardu': `Mardu`,
    'clan-sultai': `Sultai`,
    'clan-temur': `Temur`,
    'clan-atarka': `Atarka`,
    'clan-dromoka': `Dromoka`,
    'clan-kolaghan': `Kolaghan`,
    'clan-ojutai': `Ojutai`,
    'clan-silumgar': `Silumgar`,
  },
  'Poleis Symbols': {
    'polis-setessa': `Setessa`,
    'polis-akros': `Akros`,
    'polis-meletis': `Meletis`,
  },
};
