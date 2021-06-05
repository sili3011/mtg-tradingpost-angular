import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { imageTooltip } from 'src/app/utils/utils';

enum RELEASES {
  NONE = '',
  ALPHA = 'Alpha',
  BETA = 'Beta',
  RELEASE = 'Release',
}

@Component({
  selector: 'mtg-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
})
export class LandingpageComponent implements OnChanges {
  @Input()
  show = true;

  @Output()
  leaveLandingpageEmitter = new EventEmitter();

  scrolled = 0;
  stick = false;
  hide = false;
  hover = false;
  selectedRelease = RELEASES.NONE;

  Releases = RELEASES;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.show.currentValue) {
      setTimeout(() => {
        this.hide = true;
      }, 3000);
    }
  }

  leave(): void {
    this.stick = false;
    this.leaveLandingpageEmitter.emit();
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

  setRelease(release: RELEASES) {
    this.selectedRelease = release;
  }
}
