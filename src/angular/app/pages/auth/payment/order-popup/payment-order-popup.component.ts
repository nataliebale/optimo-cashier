import { Subject } from 'rxjs';
import { LocalStorageService } from './../../../../services/local-storage.service';
import {
  Component,
  OnInit,
  Inject,
  ViewEncapsulation,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { MainProcessService } from '../../../../core/services/main-process/main-process.service';
import { PaymentType } from '../../../../../../shared/types/IOrder';
import { IOrderItem } from '../../../../../../shared/types/IOrderItem';
// import { CommonFunctions } from '../../../../../../shared/CommonFunctions';
import { MatDialogRef, MatDialogState, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { StockItem } from '../../../../pages/auth/dashboard/dashboard.component';
import { takeUntil } from 'rxjs/operators';
import { ComFunctions } from '../../../../shared-components/common-functions/common-functions';
import * as fromState from '../../../../state';
import * as checkActions from '../../../../state/check/check.actions';
import { Store, select } from '@ngrx/store';
import { ICheck } from '../../../../../../shared/types/ICheck';
import { ICheckItem } from '../../../../../../shared/types/ICheckItem';
import { IEntityOrderDetails } from '../../../../../../shared/types/IEntityOrderDetails';
export interface PaymentOrderPopupData {
  paymentType: PaymentType;
  message: string;
  returnAmount: any;
}

export class OrderItem implements IOrderItem {
  stockItemId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  discountRate?: number;
  stockItemIMEI?: string;
  unitOfMeasurement: number;
  barcode: string;
}

@Component({
  selector: 'app-payment-order-popup',
  templateUrl: './payment-order-popup.component.html',
  styleUrls: ['./payment-order-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentOrderPopupComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  errorText = 'გადახდა წარუმატებელია, კიდევ სცადეთ';

  paymentSucceeded: boolean;
  loadingProcess: boolean;
  totalPrice: number;
  products: ICheckItem[];
  legalEntityData: IEntityOrderDetails;
  activeCheck: ICheck;

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<PaymentOrderPopupComponent>,
    private odin: MainProcessService,
    @Inject(MAT_DIALOG_DATA) public data: PaymentOrderPopupData,
    private storage: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private _store: Store<fromState.AppState>
  ) {}

  ngOnInit(): void {
    this.initializeDataFromState();
  }

  private initializeDataFromState() {
    this._store
      .pipe(takeUntil(this.unsubscribe$), select(fromState.getActiveCheck))
      .subscribe((activeCheckResult: ICheck) => {
        if (activeCheckResult && this.dialogRef.getState() === MatDialogState.OPEN) {
          this.activeCheck = activeCheckResult;
          this.products = activeCheckResult.products;
          this.totalPrice = activeCheckResult.totalPrice;
          this.legalEntityData = activeCheckResult.legalEntityData;
          this.onPayOrder();
          this.cdr.markForCheck();
        }
      });
  }

  checkOrder() {
    this.odin.checkOrder(this.data.paymentType);
    // setTimeout(() => {
    try {
      this.odin
        .checkOrder(this.data.paymentType)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result) => {
          this.afterOrderResult(result);
        });
    } catch {}
    // }, 2000);
  }

  checkEntityOrder() {
    // setTimeout(() => {
    const paymentType: any = this.data.paymentType;
    try {
      this.odin
        .checkEntityOrder(paymentType)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result) => {
          this.afterOrderResult(result);
        });
    } catch {}
    // }, 2000);
  }

  onPayOrder(): void {
    this.loadingProcess = true;
    this.paymentSucceeded = undefined;

    if (this.storage.get('entitySwitcher') === 'ი/პ გაყიდვები') {
      this.checkEntityOrder();
    } else {
      this.checkOrder();
    }
  }

  afterOrderResult(result) {
    // todo
    if (result.err && result.err.name) {
      this.errorText = this.paymentErrorType(result);
    }
    this.loadingProcess = false;
    this.paymentSucceeded = result.data && result.data.Success && !result.err ? true : false;
    console.log('Is payment succeeded:', this.paymentSucceeded);
    this.cdr.markForCheck();

    if (this.paymentSucceeded) {
      this.clearProducts();

      console.log('Payment: ', this.data.paymentType);
      if (!(this.odin.settings.hasCashBox && this.data.paymentType === PaymentType.Cash)) {
        setTimeout(this.onBackToDashboard.bind(this), 2000);
      }
    }
  }

  private paymentErrorType(result) {
    return ComFunctions.generateErrorText(result);
  }

  private clearProducts(): void {
    this._store.dispatch(new checkActions.InitializeCheckState(null));
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onBackToDashboard(): void {
    this.dialogRef.close(true);
    this.router.navigate([this.odin.mainPageUrl]);
  }

  get hasCashbox(): boolean {
    return this.odin.settings.hasCashBox;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
