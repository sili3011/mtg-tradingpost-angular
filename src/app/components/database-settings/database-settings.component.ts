import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input()
  isDialog = false;

  dbGroup: FormGroup;
  inputJSON: any;

  isBackupped: boolean = false;
  isCreateNew: boolean = false;
  isDirty: boolean = false;
  isAdvanced: boolean = true;

  @Output()
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
        if (fileInput) {
          if (fileInput.files) {
            fileInput = fileInput.files[0];
          }
          if (fileInput.size > 0) {
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
              const stringDummy = e.target!.result as string;
              this.inputJSON = JSON.parse(stringDummy);
              this.dbGroup.patchValue(
                {
                  name: this.inputJSON.name,
                  owner: this.inputJSON.owner,
                },
                { emitEvent: false }
              );
              this.isCreateNew = false;
            };
            fileReader.readAsText(fileInput);
          }
          this.isDirty = true;
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
        this.isDirty = true;
      })
    );

    this.subscriptions.add(
      this.dbGroup.get('owner')!.valueChanges.subscribe((owner) => {
        if (!this.inputJSON) {
          this.setDummyFileToShow();
        } else if (owner !== this.inputJSON.owner) {
          this.setDummyFileToShow();
        }
        this.isDirty = true;
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
      this.isDirty = false;
    } else {
      this.dbGroup.patchValue(
        {
          name: 'default',
        },
        { emitEvent: false }
      );
    }

    if (!this.hasBeenInitialized) {
      this.isCreateNew = true;
    }

    if (this.isDialog) {
      this.isAdvanced = false;
      this.advancedChanged();
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

  createNew(): void {
    this.isCreateNew = true;
    this.dbGroup.patchValue({
      name: '',
      owner: '',
      file: new FileInput([
        new File([], '', {
          type: 'application/json',
        }),
      ]),
    });
    if (!this.inputJSON) {
      this.inputJSON = this.file;
    }
    this.isDirty = true;
  }

  createBackup(): void {
    this.dbService.setName(this.name);
    this.dbService.setName(this.owner);
    const json = this.dbService.createBackup();
    const blob = new Blob([JSON.stringify(json)], {
      type: 'text/json;charset=utf-8',
    });
    saveAs(blob, this.name + '_' + this.owner + '.json');
    this.isBackupped = true;
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

  clearName() {
    this.dbGroup.patchValue({
      name: '',
    });
  }

  clearOwner() {
    this.dbGroup.patchValue({
      owner: '',
    });
  }

  advancedChanged() {
    if (this.isAdvanced) {
      this.dbGroup.get('name')?.enable();
      this.dbGroup.get('file')?.enable();
    } else {
      this.dbGroup.get('name')?.disable();
      this.dbGroup.get('file')?.disable();
    }
  }

  confirm() {
    if (!this.isBackupped && this.hasBeenInitialized) {
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
    if (this.isCreateNew) {
      this.dbService.createNewDB(this.name, this.owner);
    } else {
      this.dbService.setDB(this.inputJSON);
    }
    this.close();
  }
}
