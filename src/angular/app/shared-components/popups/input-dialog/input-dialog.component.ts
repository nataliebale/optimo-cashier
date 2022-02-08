import {
  Component,
  OnInit,
  Inject,
  ViewEncapsulation,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  TemplateRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

export interface InputDialogData {
  title: string;
  subTitle: string;
  inputPlaceholder: string;
  onApproveFunction: (value: number) => boolean | Observable<boolean>;
  approveLabel?: string;
  declineLabel?: string;
  footerTemp?: TemplateRef<any>;
  maxLength?: number;
}

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isFormSubmited: boolean;
  error: boolean;
  numberControl: FormControl;
  customPatterns = { D: { pattern: new RegExp('[0-9]') } };

  private unsubscribe$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.form = this.fb.group({
      number: [null, Validators.required],
    });
    this.numberControl = this.form.controls.number as FormControl;

    // need for update view coused by angular can not handle multiple formcontrol
    this.numberControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe((v) => {
        this.numberControl.setValue(v, { emitEvent: false });
      });
  }

  onApprove(): void {
    this.isFormSubmited = true;
    const resultHandler = (result) => {
      if (!result) {
        this.error = true;
        this.isFormSubmited = false;
        this.setValue('');
        this.cdr.markForCheck();
        return;
      }
      this.dialogRef.close(result);
    };

    const response = this.data.onApproveFunction(+this.getValue());

    if (typeof response === 'boolean') {
      resultHandler(response);
    } else {
      response.pipe(takeUntil(this.unsubscribe$)).subscribe(resultHandler);
    }
    // let res;

    // switch (this.data.switcher) {
    //   case 0: {
    //     res = await this.odin.checkPrivilegeElevationPassword(
    //       this.clickedKey,
    //       this.storage.get('operator-data').id
    //     );
    //     this.deleteProductService.setValue(res.data);

    //     if (res.data) {
    //       this.storage.set('active-password', JSON.stringify(this.clickedKey));
    //       this.dialogRef.close(true);
    //       return;
    //     } else {
    //       this.deleteError = true;
    //       this.clickedKey = '';
    //       this.setValue('number', '');
    //       return;
    //     }
    //   }
    //   case 2: {
    //     res = await this.odin.checkPrivilegeElevationPassword(
    //       this.clickedKey,
    //       this.storage.get('operator-data').id
    //     );
    //     if (res.data) {
    //       this.dialogRef.close(true);
    //       return;
    //     } else {
    //       this.deleteError = true;
    //       this.clickedKey = '';
    //       this.setValue('number', '');
    //       return;
    //     }
    //   }
    // }
  }

  private setValue(value: string): void {
    this.form.controls.number.setValue(value);
  }

  private getValue(): string {
    return this.form.controls.number.value;
  }

  onDecline(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
