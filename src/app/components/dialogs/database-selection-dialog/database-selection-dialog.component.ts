import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'mtg-database-selection-dialog',
  templateUrl: './database-selection-dialog.component.html',
  styleUrls: ['./database-selection-dialog.component.scss'],
})
export class DatabaseSelectionDialogComponent implements OnInit {
  dbGroup: FormGroup;

  constructor() {
    this.dbGroup = new FormGroup({
      file: new FormControl(undefined, [
        Validators.required,
        MaxSizeValidator(2 * 1024),
      ]),
      name: new FormControl('', Validators.required),
      owner: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.dbGroup.valueChanges.subscribe((changed) => console.log(changed));
  }
}
