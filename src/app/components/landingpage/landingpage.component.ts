import { Component, EventEmitter, Input, Output } from '@angular/core';
import { imageTooltip } from 'src/app/utils/utils';

@Component({
  selector: 'mtg-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
})
export class LandingpageComponent {
  @Input()
  show = true;

  @Output()
  leaveLandingpageEmitter = new EventEmitter();

  scrolled = 0;
  stick = false;
  hide = false;
  hover = false;

  constructor() {}

  leave(): void {
    this.stick = false;
    this.leaveLandingpageEmitter.emit();
    setTimeout(() => {
      this.hide = true;
    }, 3000);
  }

  handleScroll(event: any): void {
    this.stick =
      window.innerHeight * 0.6 + this.scrolled >= window.innerHeight
        ? true
        : false;
    if (this.scrolled > event.target.scrollTop || !this.stick) {
      this.scrolled = event.target.scrollTop;
    }
  }

  imageTooltip(input: string): string {
    return imageTooltip({ normal: input, art_crop: '' }, 'normal');
  }
}
