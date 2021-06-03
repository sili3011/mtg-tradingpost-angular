import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'mtg-box-opening',
  templateUrl: './box-opening.component.html',
  styleUrls: ['./box-opening.component.scss'],
})
export class BoxOpeningComponent implements OnInit {
  environment = environment;

  constructor() {}

  ngOnInit(): void {}
}
