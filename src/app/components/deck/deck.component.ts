import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Deck } from 'src/app/models/deck';
import {
  MANACOLORS,
  FORMATS,
  LISTTYPES,
  COLORS,
  CARDTYPES,
} from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';
import { DecksStore } from 'src/app/stores/decks.store';
import { deckToCurve, deckToPie, PIECHART } from 'src/app/utils/utils';
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
  curveYaxis: ApexYAxis = { labels: { style: { colors: 'gray' } } };
  // CURVE END

  // DISTRIBUTION
  distType: PIECHART = PIECHART.TYPES;
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
    labels: { colors: 'white' },
    markers: {
      fillColors: [
        '#3d684b',
        '#c6553e',
        '#383431',
        '#3b6ba0',
        '#ffffff',
        '#C9B47D',
        '#BEB9B2',
      ],
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
    colors: [
      '#3d684b',
      '#c6553e',
      '#383431',
      '#3b6ba0',
      '#ffffff',
      '#C9B47D',
      '#BEB9B2',
    ],
  };
  // DISTRINUTION END

  listExpanded: boolean = false;

  deckId: string = '';
  deck!: Deck | undefined;

  settingsGroup: FormGroup;

  settingsExpanded: boolean = false;

  @ViewChild(CardsListComponent) cardsList!: CardsListComponent;

  subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private decksStore: DecksStore,
    private dbService: DBService,
    private dialog: MatDialog,
    private fb: FormBuilder
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
        this.curveSeries = deckToCurve(this.deck!);
        this.distLabels = this.distTypeLabelConsts[this.distType];
        this.distSeries = deckToPie(
          this.deck!,
          this.distTypeLabelConsts[this.distType],
          this.distType
        );
      })
    );

    this.subscriptions.add(
      this.settingsGroup.valueChanges.subscribe((value) => {
        this.deck!.format = value.format;
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

  setCurrentDist(dt: PIECHART) {
    this.distType = dt;
    this.distLabels = this.distTypeLabelConsts[this.distType];
    this.distSeries = deckToPie(
      this.deck!,
      this.distTypeLabelConsts[this.distType],
      this.distType
    );
  }
}
