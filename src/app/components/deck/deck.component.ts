import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { CardAdapter } from 'src/app/models/card-adapter';
import { Format, Formats } from 'src/app/models/constants';
import { Deck } from 'src/app/models/deck';
import { defaultDeckValidation } from 'src/app/models/defaults';
import {
  MANACOLORS,
  FORMATS,
  LISTTYPES,
  COLORS,
  CARDTYPES,
  COLORHEXES,
} from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';
import { CardsStore } from 'src/app/stores/cards.store';
import { DecksStore } from 'src/app/stores/decks.store';
import {
  amountOfCardsOfDeck,
  deckToCurve,
  deckToPie,
  DeckValidation,
  imageTooltip,
  PIECHART,
  validateDeck,
} from 'src/app/utils/utils';
import { CardsListComponent } from '../cards-list/cards-list.component';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'mtg-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnInit, OnDestroy {
  ListTypes = LISTTYPES;
  Colors = MANACOLORS;
  Pies = PIECHART;

  colorsArray = Object.keys(MANACOLORS);

  formatArray = Object.keys(FORMATS)
    .map((key) => FORMATS[parseInt(key)])
    .filter((map) => map !== '' && map !== undefined);

  currentFormat: Format = Formats.find((f) => f.format === FORMATS.STANDARD)!;

  // CURVE
  curveChart: ApexChart = {
    height: 250,
    type: 'bar',
    stacked: true,
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
    toolbar: { show: false },
    zoom: { enabled: false },
  };
  curveSeries: ApexAxisChartSeries = [];
  curveLegend: ApexLegend = { labels: { colors: 'white' } };
  curveLabels: ApexDataLabels = { enabled: false };
  curveGrid: ApexGrid = {
    borderColor: 'gray',
    strokeDashArray: 5,
  };
  curveTooltip: ApexTooltip = {
    theme: 'dark',
    x: {
      show: true,
      formatter: (val) => (val === 10 ? val - 1 + '+ CMC' : val - 1 + ' CMC'),
    },
  };
  curveXaxis: ApexXAxis = {
    type: 'category',
    categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    labels: {
      style: { colors: 'gray' },
      formatter: (val: string, timestamp?: number, opts?: any) => {
        return parseInt(val) === 10
          ? `${parseInt(val) - 1}+`
          : `${parseInt(val) - 1}`;
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  };
  curveYaxis: ApexYAxis = {
    labels: {
      style: { colors: 'gray' },
      formatter: function (val) {
        return val.toFixed(0);
      },
    },
  };
  // CURVE END

  parsedCurve: string = '';

  // DISTRIBUTION
  distType: PIECHART = PIECHART.COLORS;
  distChart: ApexChart = {
    height: 250,
    type: 'donut',
    stacked: true,
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
    toolbar: { show: false },
    zoom: { enabled: false },
  };
  distSeries: Array<number> = [];
  distLegend: ApexLegend = {
    position: 'bottom',
    labels: { colors: 'white' },
    markers: {
      fillColors: [...Object.values(COLORHEXES)],
    },
  };
  distDataLabels: ApexDataLabels = { enabled: false };
  distStroke: ApexStroke = { colors: ['#424242'] };
  distTypeLabelConsts = [
    [...Object.values(CARDTYPES)],
    [...Object.values(COLORS)],
  ];
  distLabels: Array<string> = [];
  distFill: ApexFill = {
    colors: [...Object.values(COLORHEXES)],
  };
  distTooltip: ApexTooltip = {
    theme: 'dark',
    fillSeriesColor: false,
    marker: {
      show: false,
    },
  };
  // DISTRIBUTION END

  parsedPie: string = '';

  listExpanded: boolean = false;

  deckId: string = '';
  deck!: Deck | undefined;
  deckValidation: DeckValidation = Object.assign({}, defaultDeckValidation);
  amountOfProblems: number = 0;

  missingCards: Array<CardAdapter> = [];

  settingsGroup: FormGroup;

  settingsExpanded: boolean = false;

  @ViewChild(CardsListComponent) cardsList!: CardsListComponent;

  hover: 'comm' | 'comp' = 'comm';

  currentListType = LISTTYPES.DECK;

  subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cardsStore: CardsStore,
    private decksStore: DecksStore,
    private dbService: DBService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.settingsGroup = this.fb.group({
      format: [this.deck && this.deck.format ? this.deck.format : FORMATS.NONE],
      colors: [
        this.deck && this.deck.colors ? this.deck.colors : MANACOLORS.NONE,
      ],
      art: [this.deck && this.deck.boxArt ? this.deck.boxArt : 'None'],
      isActive: [this.deck && this.deck.active ? this.deck.active : false],
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe((params) => {
        this.deckId = params.id;
        this.deck = this.decksStore.decks.find((d) => d.id === this.deckId);
        this.settingsGroup.setValue({
          format: this.deck!.format ? this.deck!.format : FORMATS.NONE,
          colors: this.deck!.colors ? this.deck!.colors : MANACOLORS.NONE,
          art: this.deck!.boxArt ? this.deck!.boxArt : 'None',
          isActive: this.deck!.active ? this.deck!.active : false,
        });
        this.currentFormat = Formats.find(
          (f) => Object.values(FORMATS)[f.format] === this.deck!.format
        )!;
        this.cd.detectChanges();
      })
    );

    this.subscriptions.add(
      this.settingsGroup.valueChanges.subscribe((value) => {
        this.deck!.format = value.format;
        this.currentFormat = Formats.find(
          (f) => Object.values(FORMATS)[f.format] === this.deck!.format
        )!;
        this.deck!.colors = value.colors;
        this.deck!.boxArt = value.art;
        this.deck!.active = value.isActive;
        this.dbService.setDeck(this.deck!);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleSettingsExpanded() {
    this.settingsExpanded = !this.settingsExpanded;
  }

  toggleListExpanded() {
    this.listExpanded = !this.listExpanded;
    this.listExpanded
      ? this.cardsList.setPageSize(10)
      : this.cardsList.setPageSize(5);
  }

  removeDeck() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Confirm deleting ' + this.deck!.name },
    });
    ref.afterClosed().subscribe(() => {
      if (ref.componentInstance.confirmed) {
        this.router.navigate([`/decks`]);
        this.dbService.removeDeck(this.deck!);
      }
    });
  }

  rerender() {
    this.deck = this.decksStore.decks.find((d) => d.id === this.deckId);
    this.curveSeries = deckToCurve(this.deck!);
    this.parsedCurve = this.parseCurveData();
    this.distLabels = this.distTypeLabelConsts[this.distType];
    this.distSeries = deckToPie(
      this.deck!,
      this.distTypeLabelConsts[this.distType],
      this.distType
    );
    this.parsedPie = this.parseColorPieData();
    if (this.currentFormat) {
      this.deckValidation = validateDeck(this.deck!, this.currentFormat);
      if (
        (this.deckValidation.amountOfProblems > 0 && this.deck?.playable) ||
        (this.deckValidation.amountOfProblems === 0 && !this.deck?.playable)
      ) {
        this.deck!.playable = !this.deck!.playable;
        this.dbService.setDeck(this.deck!);
      }
    }
    this.missingCards = this.cardsStore.missingCards.filter((c) =>
      this.deck!.cards.map((card) => [card.id, card.isFoil]).includes([
        c.id,
        c.isFoil,
      ])
    );
    this.amountOfProblems = this.getAmountOfProblems();
    this.cd.detectChanges();
  }

  parseCurveData(): string {
    let ret = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.curveSeries.forEach((series) => {
      for (let i = 0; i < ret.length; ++i) {
        ret[i] += series.data[i] as number;
      }
    });
    return ret.join('-');
  }

  parseColorPieData(): string {
    let green = 0,
      red = 0,
      black = 0,
      blue = 0,
      white = 0,
      multi = 0,
      coloreless = 0,
      landG = 0,
      landR = 0,
      landB = 0,
      landU = 0,
      landW = 0,
      landM = 0,
      landC = 0;

    this.deck?.cards.forEach((card) => {
      if (card.type_line.toLowerCase().split(' ').includes('land')) {
        if (card.color_identity.length > 1) {
          ++landM;
        } else {
          if (!card.color_identity[0]) {
            ++landC;
            return;
          }
          const mana = card.color_identity[0].toLowerCase();
          switch (mana) {
            case 'g':
              ++landG;
              break;
            case 'r':
              ++landR;
              break;
            case 'b':
              ++landB;
              break;
            case 'u':
              ++landU;
              break;
            case 'w':
              ++landW;
              break;
            case '':
              ++landC;
              break;
          }
        }
      } else {
        if (card.color_identity.length > 1) {
          ++multi;
        } else {
          if (!card.color_identity[0]) {
            ++landC;
            return;
          }
          const mana = card.color_identity[0].toLowerCase();
          switch (mana) {
            case 'g':
              ++green;
              break;
            case 'r':
              ++red;
              break;
            case 'b':
              ++black;
              break;
            case 'u':
              ++blue;
              break;
            case 'w':
              ++white;
              break;
            case '':
              ++coloreless;
              break;
          }
        }
      }
    });
    let nonLands =
      `${green > 0 ? '<span class="green">' + green + '</span>-' : ''}` +
      `${red > 0 ? '<span class="red">' + red + '</span>-' : ''}` +
      `${black > 0 ? '<span class="black">' + black + '</span>-' : ''}` +
      `${blue > 0 ? '<span class="blue">' + blue + '</span>-' : ''}` +
      `${white > 0 ? '<span class="white">' + white + '</span>-' : ''}` +
      `${multi > 0 ? '<span class="multi">' + multi + '</span>-' : ''}` +
      `${
        coloreless > 0
          ? '<span class="colorless">' + coloreless + '</span>'
          : ''
      }`;
    let lands =
      `${landG > 0 ? '<span class="green">' + landG + '</span>-' : ''}` +
      `${landR > 0 ? '<span class="red">' + landR + '</span>-' : ''}` +
      `${landB > 0 ? '<span class="black">' + landB + '</span>-' : ''}` +
      `${landU > 0 ? '<span class="blue">' + landU + '</span>-' : ''}` +
      `${landW > 0 ? '<span class="white">' + landW + '</span>-' : ''}` +
      `${landM > 0 ? '<span class="multi">' + landM + '</span>-' : ''}` +
      `${landC > 0 ? '<span class="colorless">' + landC + '</span>' : ''}`;
    nonLands =
      nonLands[nonLands.length - 1] === '-'
        ? nonLands.substr(0, nonLands.length - 1)
        : nonLands;
    lands =
      lands[lands.length - 1] === '-'
        ? lands.substr(0, lands.length - 1)
        : lands;
    return nonLands + ' | ' + lands;
  }

  setCurrentDist(dt: PIECHART): void {
    this.distType = dt;
    this.distLabels = this.distTypeLabelConsts[this.distType];
    this.distSeries = deckToPie(
      this.deck!,
      this.distTypeLabelConsts[this.distType],
      this.distType
    );
  }

  imageTooltip(card: CardAdapter | undefined, type: 'normal' | 'art'): string {
    return card
      ? card!.card_faces
        ? imageTooltip(card!.card_faces[0].image_uris!, type)
        : imageTooltip(card!.image_uris!, type)
      : '';
  }

  amountOfCardsInDeck(deck: Deck): number {
    return amountOfCardsOfDeck(deck);
  }

  setHover(hovered: 'comm' | 'comp') {
    this.hover = hovered;
  }

  getArt(card: CardAdapter): string {
    return card
      ? !card.card_faces
        ? card.image_uris!.art_crop
        : card.card_faces[0]!.image_uris!.art_crop
      : '';
  }

  getAmountOfProblems(): number {
    return this.missingCards.length > 0
      ? this.deckValidation.amountOfProblems + 1
      : this.deckValidation.amountOfProblems;
  }

  problemsToHTMLList() {
    let ret = '';
    if (!this.deckValidation.hasLegalAmountOfCards) {
      ret += `<div>${this.amountOfCardsInDeck(
        this.deck!
      )} is not a valid amount of cards in
      ${
        this.currentFormat ? this.formatArray[this.currentFormat.format] : 0
      }.</div>`;
    }
    if (!this.deckValidation.hasLegalAmountOfCopiesOfCards) {
      ret += `<div>Some cards exceed the copy limit of
      ${this.currentFormat ? this.currentFormat.maxCopiesOfCards : 0} in
      ${
        this.currentFormat ? this.formatArray[this.currentFormat.format] : 0
      }.</div>`;
    }
    if (!this.deckValidation.hasNotMoreThanMaximumOfSideboardCards) {
      ret += `<div>${
        this.deck!.sideboard.length
      } is not a valid amount of cards for a
      sideboard in
      ${
        this.currentFormat ? this.formatArray[this.currentFormat.format] : 0
      }.</div>`;
    }
    if (!this.deckValidation.hasNoIllegalCards) {
      ret += `<div>${
        this.deckValidation.illegalCards.length
      } of these cards are illegal in
      ${this.formatArray[this.currentFormat?.format]}.</div>`;
    }
    if (!this.deckValidation.hasNoIllegalColorIdentities) {
      ret += `<div>
      ${this.deckValidation.illegalColorIdentities.length} of these cards are
      illegal in ${this.deck!.colors}.</div>`;
    }
    if (!this.deckValidation.needsCommander) {
      ret += `<div>
      You need to assign a commander.</div>`;
    }
    return ret;
  }
}
