import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { PaymentMethodsBanksPopupComponent } from './banks-popup/payment-methods-banks-popup.component';
import { PaymentType } from '../../../../../../shared/types/IOrder';
import {
  PaymentOrderPopupComponent,
  PaymentOrderPopupData,
} from '../order-popup/payment-order-popup.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IEntityOrderDetails } from '../../../../../../shared/types/IEntityOrderDetails';

export enum PaymentMethod {
  Cash = 0,
  BOG = 1,
  BOGExternal = 2,
  TBCExternal = 3,
  LibertyExternal = 4,
  ProcreditExternal = 5,
  Manual = 98,
  Other = 99,
}

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodsComponent implements OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('paymentMethod')
  activePaymentMethod: PaymentMethod;

  private _legalEntityData: IEntityOrderDetails;
  @Input()
  set legalEntityData(value: IEntityOrderDetails) {
    this._legalEntityData = value;
    this.checkDisabledMethods();
  }

  get legalEntityData(): IEntityOrderDetails {
    return this._legalEntityData;
  }

  @Output()
  methodChange = new EventEmitter<PaymentMethod>();

  @Output()
  printCheckOutput = new EventEmitter<boolean>();

  PaymentMethod = PaymentMethod;
  printCheck = true;
  PaymentType = PaymentType;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private storage: LocalStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  private checkDisabledMethods(): void {
    if (this.storage.get('entitySwitcher') === 'საცალო გაყიდვები' || !this.legalEntityData) {
      return;
    }

    switch (this.legalEntityData.paymentType) {
      case 'consignation':
        this.printCheck = false;
        break;
      case 'byCash':
        this.printCheck = true;
        this.methodChange.emit(PaymentMethod.Cash);
        break;
      case 'byCard':
        this.onOpenCardPayment();
        break;
    }
  }

  onOpenCardPayment(): void {
    this.dialog.open(PaymentMethodsBanksPopupComponent, {
      width: '705px',
      panelClass: 'payment-method-popup',
    });
  }

  onPrintCheckButtonChange(): void {
    this.printCheck = !this.printCheck;
    this.printCheckOutput.emit(this.printCheck);
  }

  onPaymentClick(paymentType: PaymentType, title: string): void {
    this.dialog
      .open(PaymentOrderPopupComponent, {
        width: '500px',
        disableClose: true,
        data: {
          paymentType,
          message: `მიმდინარეობს ${title} გადახდა`,
        } as PaymentOrderPopupData,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        console.log(result);
        if (result) {
          this.dialog.closeAll();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
