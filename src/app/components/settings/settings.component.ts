import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { autorun, IReactionDisposer } from 'mobx';
import { CURRENCY } from 'src/app/models/enums';
import { DBService } from 'src/app/services/db.service';
import { CardsStore } from 'src/app/stores/cards.store';
import { DatabaseSelectionDialogComponent } from '../dialogs/database-selection-dialog/database-selection-dialog.component';

@Component({
  selector: 'mtg-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  disposer!: IReactionDisposer;

  selectedCurrency: CURRENCY = CURRENCY.EUR;
  currencies = CURRENCY;
  currencyControl = new FormControl();

  subscriptions: Array<any> = [];

  constructor(
    private dialog: MatDialog,
    private cardStore: CardsStore,
    private dbService: DBService
  ) {}

  ngOnInit(): void {
    this.disposer = autorun(() => {
      this.selectedCurrency = this.cardStore.networth.currency;
    });

    this.subscriptions.push(
      this.currencyControl.valueChanges.subscribe((currency) =>
        this.dbService.setCurrency(currency)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.disposer();
  }

  openDBDialog() {
    this.dialog.open(DatabaseSelectionDialogComponent, {
      width: '50%',
      disableClose: true,
    });
  }
}
