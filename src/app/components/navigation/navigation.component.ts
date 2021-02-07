import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';
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

  constructor(private _sidenavService: SidenavService) {
    this._sidenavService.sideNavState$.subscribe((res) => {
      this.onSideNavChange = res;
    });
  }

  ngOnInit(): void {}

  onSidenavToggle() {
    this.sideNavState = !this.sideNavState;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
    this._sidenavService.sideNavState$.next(this.sideNavState);
  }
}
