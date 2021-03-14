import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionComponent } from './components/collection/collection.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DeckManagementComponent } from './components/deck-management/deck-management.component';
import { DeckComponent } from './components/deck/deck.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'collection', component: CollectionComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'decks', component: DeckManagementComponent },
  { path: 'deck/:id', component: DeckComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
