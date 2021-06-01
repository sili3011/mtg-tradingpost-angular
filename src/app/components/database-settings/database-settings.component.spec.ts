import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseSettingsComponent } from './database-settings.component';

describe('DatabaseSettingsComponent', () => {
  let component: DatabaseSettingsComponent;
  let fixture: ComponentFixture<DatabaseSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
