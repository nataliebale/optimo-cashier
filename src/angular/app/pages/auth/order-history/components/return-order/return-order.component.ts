import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { delay, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { SaleReturnReason } from '../../../../../../../shared/enums/SaleReturnReason';
import {
  IOrderLine,
  ITransactionDetails,
} from '../../../../../../../shared/types/ITransactionDetails';
import {
  arrayHasAtLeastOneValueSet,
  higherThanZeroOrNull,
  lessThanOrEqualToOrderedOrNull,
} from '../../helpers/validators';
import { IReturDetails } from '../../interfaces/IReturnDetails';
import { isEqual } from 'lodash-es';
import { MainProcessService } from '../../../../../core/services/main-process/main-process.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';

export interface ReturnOrderLine extends IOrderLine {
  controlGroup: FormGroup;
  mask: string;
  isDecimal: boolean;
}

export enum ReturnDialogActions {
  close,
}

@Component({
  selector: 'app-return-order',
  templateUrl: './return-order.component.html',
  styleUrls: ['./return-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnOrderComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  // private customPannelClasses = ['custom__dialog'];

  @Input()
  orderData: ITransactionDetails;

  @Output()
  returnDetails = new EventEmitter<IReturDetails>();

  @Output()
  dialogActions = new EventEmitter<ReturnDialogActions>();

  form: FormGroup;

  focusedFormControl: FormControl;
  numpadCoordinates: { x: number; y: number; openTop?: boolean };
  numpadIsDecimal = false;

  submitted = false;

  orderLines: ReturnOrderLine[] = [];

  SaleReturnReasonOptions = [
    { value: SaleReturnReason.Damaged, label: 'წუნდებული პროდუქცია' },
    { value: SaleReturnReason.WrongPrice, label: 'ფასის ცდომილება' },
    { value: SaleReturnReason.WrongRealization, label: 'არასწორი რეალიზაცია' },
    { value: SaleReturnReason.WrongProduct, label: 'არასწორი პროდუქცია' },
    { value: SaleReturnReason.WrongQuantity, label: 'არასწორი რაოდენობა' },
    { value: SaleReturnReason.Other, label: 'სხვა' },
  ];

  constructor(
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _odin: MainProcessService,
    private _storage: LocalStorageService
  ) {}

  initForm(): void {
    const returnOrderLinesArr = this.orderData.orderLines.map((orderLine) => {
      const group = this._fb.group({
        stockItemId: this._fb.control(orderLine.stockItemId, Validators.required),
        stockItemIMEI: this._fb.control(orderLine.IMEI),
        returnQuantity: this._fb.control(null, [
          lessThanOrEqualToOrderedOrNull(orderLine.quantity),
          higherThanZeroOrNull,
        ]),
        delitsAfterReturn: this._fb.control({
          value: orderLine.isReceipt ? true : false,
          disabled: orderLine.isReceipt,
        }),
      });
      this.orderLines.push({
        ...orderLine,
        controlGroup: group,
        mask: orderLine.unitOfMeasurement === 1 ? 'separator.0' : 'separator.3',
        isDecimal: orderLine.unitOfMeasurement === 1 ? false : true,
      });

      // needed for numpad implementation
      const returnControl = group.controls.returnQuantity;
      returnControl.valueChanges
        .pipe(distinctUntilChanged(isEqual), takeUntil(this.unsubscribe$))
        .subscribe((v) => {
          returnControl.setValue(v, { emitEvent: false });
        });

      return group;
    });
    this.form = this._fb.group(
      {
        returnItems: this._fb.array(returnOrderLinesArr, arrayHasAtLeastOneValueSet()),
        returnReason: this._fb.control(null, Validators.required),
        transactionId: this._fb.control(this.orderData.id),
      },
      {}
    );

    // console.log('dev => form init finished:', this.form);
  }

  get orderLineControlsArray(): FormArray {
    return this.form.controls.returnItems as FormArray;
  }

  get orderLineControls(): AbstractControl[] {
    // console.log('dev => orderLineControls', this.orderLineControlsArray.controls);
    return this.orderLineControlsArray.controls;
  }

  get isFormInvalid(): boolean {
    return this.submitted && this.form?.invalid;
  }

  get validationErrorText(): string {
    if (this.form.invalid) {
      // console.log('dev => get validationErrorText => this.form', this.form);
      // will be set to index of control which has specific error "value higher than ordered amount"
      const hasHigherReturnThanOrderedError = (this.form.controls
        .returnItems as FormArray).controls.findIndex((formGroup: FormGroup) =>
        formGroup.controls.returnQuantity.hasError('value higher than ordered amount')
      );
      if (hasHigherReturnThanOrderedError > -1) {
        return 'დასაბრუნებელი პროდუქტების რაოდენობა აღემატება გაყიდულ რაოდენობას!';
      }
      return 'შეავსე გამორჩენილი ველები';
    }
    return '';
  }

  logForm(): void {
    console.log('dev => ReturnOrderComponent => form:', this.form.getRawValue());
  }

  submitForm(): void {
    console.log(
      'dev => ReturnOrderComponent => ',
      this.form.status,
      'form submitted:',
      this.form.getRawValue()
    );
    if (this.form.valid) {
      this.returnDetails.emit({
        ...this.form.getRawValue(),
        paymentType: this.orderData.paymentType,
      } as IReturDetails);
    } else {
      this.submitted = true;
      this.form.markAllAsTouched();
    }
  }

  onNumpadFocusOut(e: any): void {
    if (e.tagName === 'INPUT') {
      return;
    }
    this.focusedFormControl = null;
  }

  onInputFocus(formControl: FormControl, isDecimal: boolean, e: FocusEvent): void {
    if (window.innerWidth < 1640) {
      return;
    }

    const { x, y, width, height, bottom } = (e.target as any).getBoundingClientRect();
    console.log('dev => onInputFocus', 9999);

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
    this.focusedFormControl = null;
    this._cdr.detectChanges();

    this.focusedFormControl = formControl;
    this.numpadIsDecimal = isDecimal;
    this._cdr.markForCheck();
  }

  toggleOrderLineDelist(orderLine: ReturnOrderLine): void {
    if (orderLine.isReceipt) return; // do not toggle receipt always delist
    orderLine.controlGroup.controls.delitsAfterReturn.setValue(
      !orderLine.controlGroup.controls.delitsAfterReturn.value
    );
  }

  onNumpadClose(): void {
    this.focusedFormControl = null;
    // this._dialogRef.removePanelClass(this.customPannelClasses);
  }

  ngOnInit(): void {
    // console.log('dev => ReturnOrderComponent => orderDetails:', this.orderData);
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
