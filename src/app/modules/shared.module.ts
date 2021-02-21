import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexModule } from '@angular/flex-layout/flex';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    // Angular Material
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatRippleModule,
    MatDialogModule,
    MatInputModule,
    // Angular Flex
    FlexModule,
    FlexLayoutModule,
    // Third Party
    NgxMatFileInputModule,
  ],
})
export class SharedModule {}
