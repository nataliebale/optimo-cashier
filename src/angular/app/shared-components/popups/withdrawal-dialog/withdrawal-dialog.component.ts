import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import { OptimoProductType } from '../../../../../shared/enums/OptimoProductType';

enum WithdrawReason {
  Supplier = 1,
  Other = 2,
  Waitress = 3,
}

@Component({
  selector: 'app-withdrawal-dialog',
  templateUrl: './withdrawal-dialog.component.html',
  styleUrls: ['./withdrawal-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawalDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isSubmited: boolean;
  focusedFormControlName: string;
  WithdrawReason = WithdrawReason;
  numpadCoordinates: { x: number; y: number; openTop?: boolean };
  public get isHorecaMode(): boolean {
    return this.odin?.settings?.productType === OptimoProductType.HORECA;
  }

  reasons = [
    { value: WithdrawReason.Supplier, label: 'მომწოდებელზე გაცემა' },
    { value: WithdrawReason.Other, label: 'სხვა' },
  ];

  private customPannelClasses = ['custom__dialog', 'custom__dialog-short'];
  private unsubscribe$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<WithdrawalDialogComponent>,
    private fb: FormBuilder,
    private odin: MainProcessService,
    public storage: LocalStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.isHorecaMode) {
      this.reasons.splice(this.reasons.length - 1, 0, {
        value: WithdrawReason.Waitress,
        label: 'მიმტანი',
      });
    }
    this.createForm();
  }

  private createForm(): void {
    this.form = this.fb.group({
      number: ['', Validators.required],
      reason: [1, Validators.required],
      comment: [''],
    });

    // need for update view coused by angular can not handle multiple formcontrol
    this.form.valueChanges
      .pipe(distinctUntilChanged(isEqual), takeUntil(this.unsubscribe$))
      .subscribe((v) => {
        this.form.setValue(v, { emitEvent: false });
      });
  }

  onInputFocus(focusedFormControlName: string, e: any): void {
    const { x, y, width, height, bottom } = e.getBoundingClientRect();
    console.log(9999, e);

    if (bottom > 570) {
      this.numpadCoordinates = {
        x: x + width / 2 - 200,
        y: y - 412,
        openTop: true,
      };
    } else {
      this.numpadCoordinates = { x: x + width / 2 - 200, y: y + height + 12 };
    }

    // need for restore numpad, coused by angular bug
    this.focusedFormControlName = null;
    this.cdr.detectChanges();

    this.focusedFormControlName = focusedFormControlName;

    // if (window.innerWidth >= 1640) {
    //   this.dialogRef.addPanelClass(this.customPannelClasses);
    // }
    this.cdr.markForCheck();
  }

  onNumpadFocusOut(e: any): void {
    console.log('WithdrawalDialogComponent -> onNumpadFocusOut -> e', e);
    if (e.tagName === 'INPUT' || e.tagName === 'TEXTAREA') {
      return;
    }
    this.focusedFormControlName = null;
  }

  onNumpadClose(): void {
    this.focusedFormControlName = null;
    // this.dialogRef.removePanelClass(this.customPannelClasses);
  }

  onSubmit(): void {
    this.isSubmited = true;
    let reason: string;
    switch (this.getValue('reason')) {
      case WithdrawReason.Other:
        reason = this.getValue('comment');
        break;
      case WithdrawReason.Waitress:
        reason = 'მიმტანზე გაცემა';
        break;
      case WithdrawReason.Supplier:
        reason = 'მომწოდებელზე გაცემა';
        break;
      default:
        break;
    }
    const data = {
      // todo back
      amount: Number(this.getValue('number')),
      reason: reason,
    };

    this.odin
      .withdrawCash(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result) => {
          // todo back, err in error
          if (result && !result.err) {
            this.dialogRef.close(true);
          } else {
            this.isSubmited = false;
            this.cdr.markForCheck();
          }
        },
        () => {
          this.isSubmited = false;
          this.cdr.markForCheck();
        }
      );
  }

  onReasonChange({ value }): void {
    const { comment } = this.form.controls;
    if (value === WithdrawReason.Other) {
      comment.setValidators(Validators.required);
    } else {
      comment.clearValidators();
    }
    comment.setValue('');
    comment.updateValueAndValidity();
  }

  getValue(controlName: string): any {
    return this.form.controls[controlName].value;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
