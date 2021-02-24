import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FileInput, FileValidator } from 'ngx-material-file-input';
import { DBService } from 'src/app/services/db.service';

@Component({
  selector: 'mtg-database-selection-dialog',
  templateUrl: './database-selection-dialog.component.html',
  styleUrls: ['./database-selection-dialog.component.scss'],
})
export class DatabaseSelectionDialogComponent implements OnInit {
  dbGroup: FormGroup;
  inputJSON: any;

  constructor(
    private dbService: DBService,
    private dialogRef: MatDialogRef<DatabaseSelectionDialogComponent>
  ) {
    this.dbGroup = new FormGroup({
      file: new FormControl(undefined, [
        Validators.required,
        FileValidator.maxContentSize(4194304), // (4*2^20)
      ]),
      name: new FormControl('', Validators.required),
      owner: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.dbGroup.get('file')!.valueChanges.subscribe((fileInput) => {
      if (fileInput.files) {
        fileInput = fileInput.files[0];
      }
      if (fileInput.size > 0) {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          const stringDummy = e.target!.result as string;
          this.inputJSON = JSON.parse(stringDummy);
          this.dbGroup.patchValue({
            name: this.inputJSON.name,
            owner: this.inputJSON.owner,
          });
        };
        fileReader.readAsText(fileInput);
      }
    });

    this.dbGroup.get('name')!.valueChanges.subscribe((name) => {
      if (!this.inputJSON) {
        this.setDummyFileToShow();
      } else if (name !== this.inputJSON.name) {
        this.setDummyFileToShow();
      }
    });

    this.dbGroup.get('owner')!.valueChanges.subscribe((owner) => {
      if (!this.inputJSON) {
        this.setDummyFileToShow();
      } else if (owner !== this.inputJSON.owner) {
        this.setDummyFileToShow();
      }
    });
  }

  setDummyFileToShow() {
    if (this.name.trim() !== '' && this.owner.trim() !== '')
      this.dbGroup.patchValue({
        file: new FileInput([
          new File([], this.name + '_' + this.owner + '.json', {
            type: 'application/json',
          }),
        ]),
      });
  }

  get name() {
    return this.dbGroup.get('name')?.value;
  }

  get owner() {
    return this.dbGroup.get('owner')?.value;
  }

  get file() {
    return this.dbGroup.get('file')?.value;
  }

  get hasBeenInitialized() {
    return this.dbService.getHasBeenInitialized();
  }

  close() {
    this.dialogRef.close();
  }

  confirm() {
    this.dbService.setDB(this.inputJSON);
    this.close();
  }
}
