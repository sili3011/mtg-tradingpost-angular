import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { CURRENCIES } from 'src/app/models/enums';
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

  selectedCurrency: CURRENCIES = CURRENCIES.EUR;
  currencies = CURRENCIES;
  currencyControl = new FormControl();

  subscriptions: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private cardStore: CardsStore,
    private dbService: DBService
  ) {}

  ngOnInit(): void {
    this.disposer = autorun(() => {
      this.selectedCurrency = this.cardStore.networth.currency;
      this.currencyControl.setValue(this.selectedCurrency);
    });

    this.subscriptions.add(
      this.currencyControl.valueChanges.subscribe((currency) =>
        this.dbService.setCurrency(currency)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.disposer();
  }

  openDBDialog() {
    this.dialog.open(DatabaseSelectionDialogComponent, {
      width: '50%',
      disableClose: true,
    });
  }
}
