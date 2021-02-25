import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { autorun, IReactionDisposer } from 'mobx';
import { CardAdapter } from 'src/app/models/card-adapter';
import { CardsStore } from 'src/app/stores/cards.store';

@Component({
  selector: 'mtg-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'name'];
  dataSource: MatTableDataSource<CardAdapter>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  disposer!: IReactionDisposer;

  constructor(private cardsStore: CardsStore) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.disposer = autorun(() => {
      this.dataSource = new MatTableDataSource(this.cardsStore.collection);
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
