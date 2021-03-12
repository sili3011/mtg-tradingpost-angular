import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
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

  listExpanded: boolean = false;

  deckId: string = '';
  deck!: Deck | undefined;
  deckValidation: DeckValidation = Object.assign({}, defaultDeckValidation);

  missingCards: Array<CardAdapter> = [];

  settingsGroup: FormGroup;

  settingsExpanded: boolean = false;

  @ViewChild(CardsListComponent) cardsList!: CardsListComponent;

  hover: 'comm' | 'comp' = 'comm';

  subscriptions: Subscription = new Subscription();

  constructor(
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
    this.subscriptions.add(
      ref.afterClosed().subscribe(() => {
        if (ref.componentInstance.confirmed) {
          this.dbService.removeDeck(this.deck!);
        }
      })
    );
  }

  rerender() {
    this.deck = this.decksStore.decks.find((d) => d.id === this.deckId);
    this.curveSeries = deckToCurve(this.deck!);
    this.distLabels = this.distTypeLabelConsts[this.distType];
    this.distSeries = deckToPie(
      this.deck!,
      this.distTypeLabelConsts[this.distType],
      this.distType
    );
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
      this.deck!.cards.map((card) => card.id).includes(c.id)
    );
    if (this.missingCards.length > 0) {
      ++this.deckValidation.amountOfProblems;
    }
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
            case 'B':
              ++landB;
              break;
            case 'u':
              ++landU;
              break;
            case 'W':
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
            case 'B':
              ++black;
              break;
            case 'u':
              ++blue;
              break;
            case 'W':
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
      `${green > 0 ? green + '-' : ''}` +
      `${red > 0 ? red + '-' : ''}` +
      `${black > 0 ? black + '-' : ''}` +
      `${blue > 0 ? blue + '-' : ''}` +
      `${white > 0 ? white + '-' : ''}` +
      `${multi > 0 ? multi + '-' : ''}` +
      `${coloreless > 0 ? coloreless : ''}`;
    let lands =
      `${landG > 0 ? landG + '-' : ''}` +
      `${landR > 0 ? landR + '-' : ''}` +
      `${landB > 0 ? landB + '-' : ''}` +
      `${landU > 0 ? landU + '-' : ''}` +
      `${landW > 0 ? landW + '-' : ''}` +
      `${landM > 0 ? landM + '-' : ''}` +
      `${landC > 0 ? landC : ''}`;
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

  setCurrentDist(dt: PIECHART) {
    this.distType = dt;
    this.distLabels = this.distTypeLabelConsts[this.distType];
    this.distSeries = deckToPie(
      this.deck!,
      this.distTypeLabelConsts[this.distType],
      this.distType
    );
  }

  imageTooltip(card: CardAdapter | undefined): string {
    if (card) {
      if (card.card_faces) {
        return imageTooltip(card.card_faces[0].image_uris);
      }
      return imageTooltip(card.image_uris);
    }
    return '';
  }

  cardsListToHTMLList(cards: Array<CardAdapter>) {
    let ret = '';
    cards.forEach((card) => (ret += `<div>${card.name}</div>`));
    return ret;
  }

  amountOfCardsInDeck(deck: Deck): number {
    return amountOfCardsOfDeck(deck);
  }

  setHover(hovered: 'comm' | 'comp') {
    this.hover = hovered;
  }
}
