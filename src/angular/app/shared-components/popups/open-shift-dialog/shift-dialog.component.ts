import { LocalStorageService } from './../../../services/local-storage.service';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { KEYS } from './shift-numpad.mock';
import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShiftService } from '../../../core/services/shift.service';

export interface ShiftDialogData {
  title: string;
  subTitle: string;
  formPlaceholder: string;
  switcher: number; // 0: nothing, 1: shift, 2: check
  approveLabel?: string;
  declineLabel?: string;
}

@Component({
  selector: 'app-shift-dialog',
  templateUrl: './shift-dialog.component.html',
  styleUrls: ['./shift-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShiftDialogComponent implements OnInit, OnDestroy {
  shiftForm: FormGroup;
  isShiftStarted: boolean;
  numberForShift = 1;
  isFormClicked: boolean;
  keys = KEYS;
  clickedKey = '';
  deleteError: boolean;

  constructor(
    public dialogRef: MatDialogRef<ShiftDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShiftDialogData,
    private fb: FormBuilder,
    private odin: MainProcessService,
    public shiftService: ShiftService,
    public storage: LocalStorageService // private deleteProductService: DeleteProductService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.shiftForm = this.fb.group({
      number: [null, Validators.required],
    });
  }

  decline(): void {
    this.dialogRef.close();
  }

  async approve() {
    let res;

    switch (this.data.switcher) {
      case 0: {
        res = await this.odin.checkPrivilegeElevationPassword(
          this.clickedKey,
          this.storage.get('operator-data').id
        );
        // this.deleteProductService.setValue(res.data);

        if (res.data) {
          this.storage.set('active-password', JSON.stringify(this.clickedKey));
          this.dialogRef.close(true);
          return;
        } else {
          this.deleteError = true;
          this.clickedKey = '';
          this.setValue('number', '');
          return;
        }
      }
      case 1: {
        const result = await this.odin.getShift();
        this.isFormClicked = true;

        if (!result.data) {
          await this.odin.startShift(Number(this.clickedKey));
        } else {
          await this.odin.finishShift(Number(this.clickedKey));
        }

        this.storage.set('checkNumber', JSON.stringify(1));
        this.storage.set('checks', JSON.stringify([{ id: 1, products: [] }]));
        this.storage.set('activeCheck', JSON.stringify({ id: 1 }));

        this.dialogRef.close(true);
        this.shiftService.setData(this.numberForShift);
        this.numberForShift += 1;
        break;
      }
      case 2: {
        res = await this.odin.checkPrivilegeElevationPassword(
          this.clickedKey,
          this.storage.get('operator-data').id
        );
        if (res.data) {
          this.dialogRef.close(true);
          return;
        } else {
          this.deleteError = true;
          this.clickedKey = '';
          this.setValue('number', '');
          return;
        }
      }
    }
  }

  keyPress() {
    this.deleteError = false;
    this.setValue('number', this.clickedKey);
  }

  private getValue(controlName) {
    return this.shiftForm.controls[controlName].value;
  }

  private setValue(controlName, value): void {
    this.shiftForm.controls[controlName].setValue(value);
  }

  triggerKey(key) {
    this.deleteError = false;
    this.setTriggerKey(key);
  }

  setTriggerKey(value) {
    if (
      this.clickedKey.indexOf('.') === this.clickedKey.length - 3 &&
      this.clickedKey.indexOf('.') !== -1
    ) {
      return;
    }
    if (this.clickedKey === '0') {
      this.clickedKey = value.view;
    } else {
      this.clickedKey += value.view;
    }
    console.log(this.clickedKey);
  }

  triggerZero() {
    const value = {
      view: '0',
      value: '0',
      isActionValue: false,
    };
    if (
      this.clickedKey.indexOf('.') === this.clickedKey.length - 3 &&
      this.clickedKey.indexOf('.') !== -1
    ) {
      return;
    }
    if (this.clickedKey === '0') {
      return;
    }
    this.clickedKey += value.view;
  }

  triggerBackspace() {
    this.clickedKey = this.clickedKey.toString().slice(0, -1);
  }

  triggerDot() {
    const value = {
      view: '.',
      value: '.',
      isActionValue: true,
    };

    if (this.clickedKey.indexOf('.') !== -1 || this.clickedKey.length === 0) {
      return;
    }
    this.clickedKey += value.view;
  }

  ngOnDestroy(): void {}
}
