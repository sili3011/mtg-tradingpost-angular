import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'mtg-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
})
export class LandingpageComponent implements OnInit {
  @Input()
  show = true;

  @Output()
  leaveLandingpageEmitter = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  leave() {
    this.leaveLandingpageEmitter.emit();
  }
}
