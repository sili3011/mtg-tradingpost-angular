import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooSmallWarningDialogComponent } from './too-small-warning-dialog.component';

describe('TooSmallWarningDialogComponent', () => {
  let component: TooSmallWarningDialogComponent;
  let fixture: ComponentFixture<TooSmallWarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TooSmallWarningDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TooSmallWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
