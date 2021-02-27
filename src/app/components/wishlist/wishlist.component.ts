import { Component, OnInit } from '@angular/core';
import { LISTTYPES } from 'src/app/models/enums';

@Component({
  selector: 'mtg-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  ListTypes = LISTTYPES;

  constructor() {}

  ngOnInit(): void {}
}
