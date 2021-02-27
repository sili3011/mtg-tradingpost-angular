import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IReactionDisposer, autorun } from 'mobx';
import { CardAdapter } from 'src/app/models/card-adapter';
import { LISTTYPES } from 'src/app/models/enums';
import { CardsStore } from 'src/app/stores/cards.store';

@Component({
  selector: 'mtg-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss'],
})
export class CardsListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'set',
    'mana_cost',
    'cmc',
    'prices.eur',
    'amount',
  ];
  dataSource: MatTableDataSource<CardAdapter>;

  @Input()
  listType!: LISTTYPES;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  disposer!: IReactionDisposer;

  constructor(private cardsStore: CardsStore) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.disposer = autorun(() => {
      switch (this.listType) {
        case LISTTYPES.collection:
          this.dataSource = new MatTableDataSource(this.cardsStore.collection);
          break;
        case LISTTYPES.wishlist:
          this.dataSource = new MatTableDataSource(this.cardsStore.wishlist);
          break;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.disposer();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
