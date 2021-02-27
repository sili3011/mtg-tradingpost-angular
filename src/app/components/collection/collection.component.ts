import { Component, OnInit } from '@angular/core';
import { LISTTYPES } from 'src/app/models/enums';

@Component({
  selector: 'mtg-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnInit {
  ListTypes = LISTTYPES;

  ngOnInit(): void {}
}
