import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaymentType } from '../../../../../../../shared/types/IOrder';
import {
  PaymentOrderPopupComponent,
  PaymentOrderPopupData,
} from '../../order-popup/payment-order-popup.component';

@Component({
  selector: 'app-payment-methods-banks-popup',
  templateUrl: './payment-methods-banks-popup.component.html',
  styleUrls: ['./payment-methods-banks-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PaymentMethodsBanksPopupComponent {
  PaymentType = PaymentType;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<PaymentMethodsBanksPopupComponent>,
    private dialog: MatDialog
  ) {}

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

  onClose(): void {
    this.dialogRef.close();
  }
}
