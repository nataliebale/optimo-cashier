import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ICheck } from '../../../../../shared/types/ICheck';
import { PaymentType } from '../../../../../shared/types/IOrder';
import { LocalStorageService } from '../../../services/local-storage.service';
import * as fromState from '../../../state';
import {
  PaymentOrderPopupComponent,
  PaymentOrderPopupData,
} from './order-popup/payment-order-popup.component';
import { IEntityOrderDetails } from '../../../../../shared/types/IEntityOrderDetails';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { OptimoProductType } from '../../../../../shared/enums/OptimoProductType';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit, OnDestroy {
  products: any;
  form: FormGroup;
  amountControl: FormControl;
  checkPrint = true;
  totalPrice: string;
  paymentType: string;
  legalEntityData: IEntityOrderDetails;

  private unsubscribe$ = new Subject<void>();
  returnAmount: any;

  get isConsignation(): boolean {
    return this.paymentType === 'consignation';
  }
  get isCash(): boolean {
    return this.paymentType === 'byCash';
  }
  disableSubmitButton: boolean;

  public get isHorecaMode(): boolean {
    return this._mainProcessService?.settings?.productType === OptimoProductType.HORECA;
  }
  constructor(
    private storage: LocalStorageService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private _store: Store<fromState.AppState>,
    protected _mainProcessService: MainProcessService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.initializeDataFromState();
  }

  private initializeDataFromState() {
    this._store
      .pipe(takeUntil(this.unsubscribe$), select(fromState.getActiveCheck))
      .subscribe((activeCheckResult: ICheck) => {
        if (activeCheckResult) {
          this.products = activeCheckResult.products;
          this.paymentType = activeCheckResult?.legalEntityData?.paymentType;
          this.legalEntityData = activeCheckResult.legalEntityData;
          this.totalPrice = activeCheckResult.totalPrice.toFixed(2);
          this.returnAmount = this.isConsignation || this.isCash ? 0 : -this.totalPrice;
          if (this.isConsignation) {
            this.checkPrint = false;
          }
          if (this.isConsignation || this.isCash) {
            this.onExactAmount();
          }
          this.cdr.markForCheck();
        }
      });
  }

  private createForm(): void {
    this.form = this.fb.group({
      amount: [null, Validators.required],
    });
    this.amountControl = this.form.controls.amount as FormControl;
    this.cdr.markForCheck();

    // need for update view coused by angular can not handle multiple formcontrol
    this.amountControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe((v) => {
        this.amountControl.setValue(v, { emitEvent: false });
      });
  }

  onSubmit(): void {
    this.disableSubmitButton = true;
    console.log(12333, this.paymentType, 'print check: ', this.checkPrint);
    if (this.storage.get('entitySwitcher') === 'ი/პ გაყიდვები') {
      if (this.paymentType === 'consignation' && !this.checkPrint) {
        console.log('-------- conignation --------');
        this.openPaymentOrderPopup(PaymentType.Manual, 'მიმდინარეობს კონსიგნაციით გადახდა');
        return;
      }

      if (this.paymentType === 'byCash' && this.checkPrint) {
        console.log('-------- cash --------');
        this.openPaymentOrderPopup(PaymentType.Cash, 'ნაღდი ანგარიშსწორება');
        return;
      }
    }

    if (this.checkPrint) {
      console.log('-------- cash --------');
      this.openPaymentOrderPopup(PaymentType.Cash, 'ნაღდი ანგარიშსწორება');
    } else {
      console.log('-------- manual --------');
      this.openPaymentOrderPopup(PaymentType.Manual, 'მიმდინარეობს მანუალური გადახდა');
    }
  }

  private openPaymentOrderPopup(paymentType: PaymentType, message: string): void {
    this.dialog
      .open(PaymentOrderPopupComponent, {
        width: '500px',
        disableClose: true,
        data: {
          paymentType,
          message,
          returnAmount: this.returnAmount,
        } as PaymentOrderPopupData,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        console.log('result => ' + result);

        if (result === false) {
          this.disableSubmitButton = false;
          this.cdr.markForCheck();
        }
      });
  }

  onPrintCheckButtonChange(value: boolean): void {
    this.checkPrint = value;
  }

  onExactAmount(): void {
    this.amountControl.setValue(this.totalPrice);
    this.cdr.markForCheck();
  }

  onReturnAmountChange(event): void {
    this.returnAmount = event;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
