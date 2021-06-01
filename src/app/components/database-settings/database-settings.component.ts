import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileValidator, FileInput } from 'ngx-material-file-input';
import { Subscription } from 'rxjs';
import { DBService } from 'src/app/services/db.service';
import { OverwriteDatabaseConfirmationDialogComponent } from '../dialogs/overwrite-database-confirmation-dialog/overwrite-database-confirmation-dialog.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'mtg-database-settings',
  templateUrl: './database-settings.component.html',
  styleUrls: ['./database-settings.component.scss'],
})
export class DatabaseSettingsComponent implements OnInit {
  dbGroup: FormGroup;
  inputJSON: any;

  backupped: boolean = false;
  createNew: boolean = false;

  closeEmitter: EventEmitter<void> = new EventEmitter();

  subscriptions: Subscription = new Subscription();

  constructor(private dbService: DBService, private dialog: MatDialog) {
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
    this.subscriptions.add(
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
            this.createNew = false;
          };
          fileReader.readAsText(fileInput);
        }
      })
    );

    this.subscriptions.add(
      this.dbGroup.get('name')!.valueChanges.subscribe((name) => {
        if (!this.inputJSON) {
          this.setDummyFileToShow();
        } else if (name !== this.inputJSON.name) {
          this.setDummyFileToShow();
        }
      })
    );

    this.subscriptions.add(
      this.dbGroup.get('owner')!.valueChanges.subscribe((owner) => {
        if (!this.inputJSON) {
          this.setDummyFileToShow();
        } else if (owner !== this.inputJSON.owner) {
          this.setDummyFileToShow();
        }
      })
    );

    if (this.dbService.getHasBeenInitialized()) {
      this.dbGroup.patchValue({
        name: this.dbService.getName(),
        owner: this.dbService.getOwner(),
      });

      const json = this.dbService.createBackup();
      const blob = new Blob([JSON.stringify(json)], {
        type: 'text/json;charset=utf-8',
      });
      const dbAsFile = new File(
        [blob],
        this.name + '_' + this.owner + '.json',
        {
          type: 'application/json',
        }
      );
      this.dbGroup.patchValue({
        file: new FileInput([dbAsFile]),
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setDummyFileToShow() {
    if (this.name.trim() !== '' && this.owner.trim() !== '') {
      this.dbGroup.patchValue({
        file: new FileInput([
          new File([], this.name + '_' + this.owner + '.json', {
            type: 'application/json',
          }),
        ]),
      });
    }
    if (!this.inputJSON) {
      this.inputJSON = this.file;
    }
  }

  createBackup() {
    const json = this.dbService.createBackup();
    const blob = new Blob([JSON.stringify(json)], {
      type: 'text/json;charset=utf-8',
    });
    saveAs(
      blob,
      this.dbService.getName() + '_' + this.dbService.getOwner() + '.json'
    );
    this.backupped = true;
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

  confirm() {
    if (
      (this.createNew && !this.backupped) ||
      (!this.createNew &&
        (this.name !== this.dbService.getName() ||
          this.owner !== this.dbService.getOwner()))
    ) {
      let ref = this.dialog.open(OverwriteDatabaseConfirmationDialogComponent, {
        width: '50%',
        disableClose: true,
        panelClass: 'confirmDialog',
      });
      ref.afterClosed().subscribe(() => {
        if (ref.componentInstance.confirmed) {
          this.complete();
        }
      });
    } else {
      this.complete();
    }
  }

  close() {
    this.closeEmitter.emit();
  }

  complete() {
    if (this.createNew) {
      this.dbService.createNewDB(this.name, this.owner);
    } else {
      this.dbService.setDB(this.inputJSON);
    }
    this.close();
  }
}
