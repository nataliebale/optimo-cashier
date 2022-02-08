import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { endOfToday, formatISO, startOfToday, startOfYear, subDays, subMonths } from 'date-fns';
import { create } from 'electron-log';
import { of, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { OptimoProductType } from '../../../../../../../shared/enums/OptimoProductType';
import { PaymentMethods } from '../../../../../../../shared/enums/PaymentMethods';
import { ICreateReturnOrderResult } from '../../../../../../../shared/types/ICreateReturnOrderResult';
import { EntityPaymentType } from '../../../../../../../shared/types/IEntityOrder';
import { PaymentType } from '../../../../../../../shared/types/IOrder';
import { IOrderResponse } from '../../../../../../../shared/types/IOrderResponse';
import { IResult } from '../../../../../../../shared/types/IResult';
import { IReturnedStockItem } from '../../../../../../../shared/types/IReturnedStockItem';
import { IReturnOrderResponse } from '../../../../../../../shared/types/IReturnOrderResponse';
import {
  ITransactionDetailAction,
  TransactionActionType,
} from '../../../../../../../shared/types/ITransactionDetailAction';
import { ITransactionDetails } from '../../../../../../../shared/types/ITransactionDetails';
import { ITransactionHistoryFilter } from '../../../../../../../shared/types/ITransactionHistoryFilter';
import { ITransactionListItem } from '../../../../../../../shared/types/ITransactionList';
import { Event, EventBusService } from '../../../../../core/services/event-bus.service';
import { MainProcessService } from '../../../../../core/services/main-process/main-process.service';
import { ComFunctions } from '../../../../../shared-components/common-functions/common-functions';
import { OrderHistoryListComponent } from '../../components/order-history-list/order-history-list.component';
import { IReturDetails, IReturnOrderLine } from '../../interfaces/IReturnDetails';

export interface IPaymentMethodsList {
  label: string;
  value: PaymentMethods;
}

export enum ReturnPopupSteps {
  form,
  confirm,
  loading,
  success,
  failed,
  retry,
}

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  @ViewChild('returnPopup')
  private returnPopup: TemplateRef<any>;

  private unsubscribe$ = new Subject();

  private _subscriptions: Subscription[] = [];

  public get isHorecaMode(): boolean {
    return this._mainProcessService?.settings?.productType === OptimoProductType.HORECA;
  }

  public filter: ITransactionHistoryFilter = {
    // from: formatISO(subMonths(startOfToday(), 1)),
    from: formatISO(subDays(startOfToday(), 1)),
    to: formatISO(endOfToday()),
  };

  public entity = false;
  public selectedTransactionId: number;
  public transactionList: ITransactionListItem[] = [];
  public transactionDetails: ITransactionDetails;

  public paymentMethodsList: IPaymentMethodsList[] = [
    { label: 'ყველა', value: undefined },
    { label: 'ნაღდი ანგარიშწორება', value: PaymentMethods.Cash },
    { label: 'ბარათით ანგარიშწორება', value: PaymentMethods.Card },
    // { label: 'მანუალური', value: PaymentMethods.Manual },
  ];

  public entityPaymentMethodsList: IPaymentMethodsList[] = [
    { label: 'ყველა', value: undefined },
    { label: 'ნაღდი ანგარიშწორება', value: PaymentMethods.Cash },
    { label: 'ბარათით ანგარიშწორება', value: PaymentMethods.Card },
    { label: 'კონსიგნაცია', value: PaymentMethods.Manual },
  ];

  returnPending = false;
  returnPopupSteps = ReturnPopupSteps;
  returnPopupStep = ReturnPopupSteps.form;
  returnOrderDetails: ICreateReturnOrderResult;
  returnPopupRetryMessage = '';
  returnRetryStep: any;
  loadingMessage = '';
  displayPaymentSumOnLoading = false;
  returnPopupTimeout: any;

  returnPopupRef: MatDialogRef<any>;

  searchStr = '';
  searchChangeEvent = new Subject<string>();

  constructor(
    private _mainProcessService: MainProcessService,
    private _eventBus: EventBusService,
    private _cd: ChangeDetectorRef,
    private _matDialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.listentToSync();
    this.getOrderList(true);
    this.listenToSearchChange();
  }

  listenToSearchChange(): void {
    this.searchChangeEvent
      .pipe(takeUntil(this.unsubscribe$), debounceTime(200))
      .subscribe((value) => {
        this.searchStr = value.trim();
        this.getOrderList();
      });
  }

  private listentToSync(): void {
    const sub$: Subscription = this._eventBus.on(Event.SYNCED).subscribe(() => {
      this.getOrderList();
      this.getOrderDetails(this.transactionDetails.id);
    });
    this._subscriptions.push(sub$);
  }

  private getOrderList(selectFirstFromList?: boolean): void {
    const sub$: Subscription = this._mainProcessService
      .getTransactionHistoryList({ ...this.filter, searchStr: this.searchStr }, this.entity)
      .subscribe((response: IResult<ITransactionListItem[]>) => {
        this.transactionList = response.data;
        this.selectFirstFromList(selectFirstFromList);
        this._cd.markForCheck();
      });
    this._subscriptions.push(sub$);
  }

  private selectFirstFromList(selectFirstFromList: boolean): void {
    if (selectFirstFromList) {
      this.transactionDetails = null;
      this.getOrderDetails(this.transactionList[0]?.id);
    }
  }

  public changeOrderType(value: boolean) {
    this.entity = value;
    this.filter = {
      ...this.filter,
      paymentMethod: undefined,
    };
    this.getOrderList(true);
  }

  public changeOrderFilter(filter: ITransactionHistoryFilter): void {
    const selectFirstFromList = this.filter.paymentMethod !== filter.paymentMethod;
    this.filter = filter;
    this.getOrderList(selectFirstFromList);
  }

  public getOrderDetails(selectedTransactionId: number): void {
    if (!selectedTransactionId) {
      return;
    }
    this.selectedTransactionId = selectedTransactionId;
    const sub$: Subscription = this._mainProcessService
      .getTransactionDetails(selectedTransactionId, this.entity)
      .subscribe((response: IResult<ITransactionDetails>) => {
        this.transactionDetails = response.data;
        this._cd.markForCheck();
      });
    this._subscriptions.push(sub$);
  }

  handleSearchChange(value: string): void {
    // console.log('dev => search chenge value:', value);
    this.searchChangeEvent.next(value);
  }

  submitReturn(returnData: IReturDetails): void {
    // console.log('dev => return data submitted', returnData);
    if (this.returnPending) return;
    this.returnPending = true;
    this._mainProcessService
      .createReturnOrder({
        transactionLogId: returnData.transactionId,
        reason: returnData.returnReason,
        returnedStockItems: returnData.returnItems
          .map(
            (val: IReturnOrderLine): IReturnedStockItem => ({
              stockItemId: val.stockItemId,
              quantity: val.returnQuantity,
              delist: val.delitsAfterReturn,
              stockItemIMEI: val.stockItemIMEI,
            })
          )
          .filter((orderLine: IReturnedStockItem) => !!orderLine.quantity),
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((createReturnOrderResult: IResult<ICreateReturnOrderResult>) => {
        // console.log('dev => createReturnOrder res', createReturnOrderResult);
        this.returnPending = false;
        if (createReturnOrderResult.err) {
          // console.error('error createing return order', createReturnOrderResult);
          this.handleReturnFailed();
          return;
        }
        this.returnOrderDetails = createReturnOrderResult.data;
        this.returnPopupStep = ReturnPopupSteps.confirm;
      });
  }

  closeDialog() {
    if (this.returnPopupTimeout) {
      clearTimeout(this.returnPopupTimeout);
    }
    this.returnPopupRef.close();
    this.getOrderList();
    this.getOrderDetails(this.transactionDetails.id);
  }

  handleConfirmReturn() {
    console.log('return now');
    this.returnPopupStep = ReturnPopupSteps.loading;
    this.displayPaymentSumOnLoading = true;
    this._mainProcessService
      .returnOrder({
        returnOrderId: this.returnOrderDetails.returnOrderId,
      })
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((returnOrderResult: IResult<IReturnOrderResponse>) => {
          // console.log('dev => returnOrderResult', returnOrderResult);
          if (returnOrderResult?.data?.success === true) {
            let transformedPaymentType: PaymentType | EntityPaymentType;
            switch (this.transactionDetails.paymentType) {
              case PaymentType.BOG:
                transformedPaymentType = PaymentType.BOGExternal;
                break;
              case EntityPaymentType.BOG:
                transformedPaymentType = EntityPaymentType.BOGExternal;
                break;
              default:
                transformedPaymentType = this.transactionDetails.paymentType;
            }
            return this.returnOrderDetails.checkId
              ? this._mainProcessService.checkOrder(transformedPaymentType as PaymentType)
              : of('order Cancelled no payment');
          } else {
            if (returnOrderResult?.err) {
              this.returnPopupRetryMessage = ComFunctions.generateErrorText(returnOrderResult);
              this.returnPopupStep = ReturnPopupSteps.retry;
              this.returnRetryStep = this.handleConfirmReturn;
              this._cd.markForCheck();
            }
            return of('return order failed');
          }
        })
      )
      .subscribe((result: IResult<IOrderResponse> | string) => {
        // console.log('dev => return or pay result', result, (result as IResult<IOrderResponse>).err);
        if (result === 'return order failed') {
          // this.handleReturnFailed();
          return;
        } else if ((result as IResult<IOrderResponse>).err) {
          this.returnPopupRetryMessage = ComFunctions.generateErrorText(result);
          this.returnPopupStep = ReturnPopupSteps.retry;
          this.returnRetryStep = this.handlePayCheck;
          this._cd.markForCheck();
        } else {
          this.returnPopupStep = ReturnPopupSteps.success;
          this.handleFinishReturn();
          this.timeoutReturnPopup();
        }
      });
  }

  handlePayCheck(): void {
    this.returnPopupStep = ReturnPopupSteps.loading;
    this.loadingMessage = 'მიმდინარეობს დაბრუნება';
    this.displayPaymentSumOnLoading = true;
    let transformedPaymentType: PaymentType | EntityPaymentType;
    switch (this.transactionDetails.paymentType) {
      case PaymentType.BOG:
        transformedPaymentType = PaymentType.BOGExternal;
        break;
      case EntityPaymentType.BOG:
        transformedPaymentType = EntityPaymentType.BOGExternal;
        break;
      default:
        transformedPaymentType = this.transactionDetails.paymentType;
    }
    this._mainProcessService
      .checkOrder(transformedPaymentType as PaymentType)
      .subscribe((result: IResult<IOrderResponse>) => {
        // console.log('dev => checkOrder result', result, (result as IResult<IOrderResponse>).err);
        if ((result as IResult<IOrderResponse>).err) {
          this.returnPopupRetryMessage = ComFunctions.generateErrorText(result);
          this.returnPopupStep = ReturnPopupSteps.retry;
          this.returnRetryStep = this.handlePayCheck;
          this._cd.markForCheck();
        } else {
          this.returnPopupStep = ReturnPopupSteps.success;
          this.handleFinishReturn();
          this.timeoutReturnPopup();
        }
      });
  }

  handleCloseDay(): void {
    this.loadingMessage = 'მიმდინარეობს დღის დახურვა';
    this.displayPaymentSumOnLoading = false;
    this.returnPopupStep = ReturnPopupSteps.loading;
    this._mainProcessService
      .closeDay()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        console.log('day closed', res);
        if (this.returnRetryStep) {
          this.returnRetryStep();
        } else {
          this.handleReturnFailed();
        }
      });
  }

  handleCancelReturn() {
    console.log('cancel now');
    this._mainProcessService
      .cancelReturnOrder({ returnOrderId: this.returnOrderDetails.returnOrderId })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.returnOrderDetails = undefined;
        this.closeDialog();
      });
  }

  handleReturnFailed() {
    if (this.returnOrderDetails) {
      this._mainProcessService
        .cancelReturnOrder({ returnOrderId: this.returnOrderDetails.returnOrderId })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.returnPopupStep = ReturnPopupSteps.failed;
          this.returnOrderDetails = undefined;
          this.timeoutReturnPopup();
        });
    } else {
      this.returnPopupStep = ReturnPopupSteps.failed;
      this.returnOrderDetails = undefined;
      this.timeoutReturnPopup();
    }
    console.log('now fail return');
  }

  timeoutReturnPopup(): void {
    this.returnPopupTimeout = setTimeout(() => {
      if (this.returnPopupRef) {
        this.closeDialog();
        this._cd.markForCheck();
      }
    }, 2000);
  }

  handleFinishReturn(): void {
    this._mainProcessService
      .finishReturnOrder({
        returnOrderId: this.returnOrderDetails.returnOrderId,
      })
      .subscribe();
  }

  handleTransactionAction(action: ITransactionDetailAction): void {
    switch (action.action) {
      case TransactionActionType.Return:
        // console.log('dev => Return action received in order-history.component', action);
        // console.log('dev => transactionDetails', this.transactionDetails);
        this.returnPopupStep = ReturnPopupSteps.form;
        this.returnPopupRef = this._matDialog.open(this.returnPopup, {
          disableClose: true,
          panelClass: ['mat-px-0', 'overflow-visible', 'mw-90vw'],
        });
        break;
      case TransactionActionType.Print:
        break;
      case TransactionActionType.OpenLinked:
        this.getOrderDetails(action.transactionId);
        break;
      default:
        console.error('dev => no action provided');
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
