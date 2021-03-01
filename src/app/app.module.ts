import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from './modules/shared.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CollectionComponent } from './components/collection/collection.component';
import { DatabaseSelectionDialogComponent } from './components/dialogs/database-selection-dialog/database-selection-dialog.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { SettingsComponent } from './components/settings/settings.component';
import { OverwriteDatabaseConfirmationDialogComponent } from './components/dialogs/overwrite-database-confirmation-dialog/overwrite-database-confirmation-dialog.component';
import { CardsListComponent } from './components/cards-list/cards-list.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { ManaComponent } from './utils/mana/mana.component';
import { SetComponent } from './utils/set/set.component';
import { DeckComponent } from './components/deck/deck.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavigationComponent,
    CollectionComponent,
    DatabaseSelectionDialogComponent,
    SettingsComponent,
    OverwriteDatabaseConfirmationDialogComponent,
    CardsListComponent,
    WishlistComponent,
    ManaComponent,
    SetComponent,
    DeckComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')
    );
  }
}
