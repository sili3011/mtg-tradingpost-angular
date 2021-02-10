import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { onSideNavChange, animateText } from 'src/app/animations/animations';

@Component({
  selector: 'mtg-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  animations: [onSideNavChange, animateText],
})
export class NavigationComponent implements OnInit {
  public sideNavState = false;
  public linkText = false;
  public onSideNavChange = false;
  public sideNavState$: Subject<boolean> = new Subject();

  constructor() {
    this.sideNavState$.subscribe((res) => {
      this.onSideNavChange = res;
    });
  }

  ngOnInit(): void {}

  onSidenavToggle() {
    this.sideNavState = !this.sideNavState;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
    this.sideNavState$.next(this.sideNavState);
  }
}
