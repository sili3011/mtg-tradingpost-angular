import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'mtg-database-selection-dialog',
  templateUrl: './database-selection-dialog.component.html',
  styleUrls: ['./database-selection-dialog.component.scss'],
})
export class DatabaseSelectionDialogComponent implements OnInit {
  files: Array<any> = [];
  fileControl: FormControl;

  constructor() {
    this.fileControl = new FormControl(this.files, [
      Validators.required,
      MaxSizeValidator(2 * 1024),
    ]);
  }

  ngOnInit(): void {
    this.fileControl.valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files)) {
        this.files = [files];
      } else {
        this.files = files;
      }
    });
  }
}
