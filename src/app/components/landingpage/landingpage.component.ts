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

  scrolled = 0;
  stick = false;

  constructor() {}

  ngOnInit(): void {}

  leave() {
    this.stick = false;
    this.leaveLandingpageEmitter.emit();
  }

  handleScroll(event: any) {
    this.stick =
      window.innerHeight * 0.6 + this.scrolled >= window.innerHeight
        ? true
        : false;
    if (this.scrolled > event.target.scrollTop || !this.stick) {
      this.scrolled = event.target.scrollTop;
    }
  }
}
