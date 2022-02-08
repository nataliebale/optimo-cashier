import { IconModule } from './../../../shared-components/icon/icon.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { PaymentComponent } from './payment.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { AuthorizedLayoutModule } from '../../../layouts/authorized-layout/authorized-layout.module';
import { MessagePopupModule } from '../../../shared-components/popups/message-popup/message-popup.module';
import { PaymentMethodsBanksPopupComponent } from './payment-methods/banks-popup/payment-methods-banks-popup.component';
import { PaymentNumpadComponent } from './numpad/payment-numpad.component';
import { NumpadModule } from '../../../shared-components/numpad/numpad.module';
import { NgxMaskModule } from 'ngx-mask';
import { PaymentAmountComponent } from './amount/payment-amount.component';
import { LoaderPopupModule } from '../../../shared-components/popups/loader-popup/loader-popup.module';
import { PaymentOrderPopupComponent } from './order-popup/payment-order-popup.component';

@NgModule({
  declarations: [
    PaymentComponent,
    PaymentAmountComponent,
    PaymentMethodsComponent,
    PaymentMethodsBanksPopupComponent,
    PaymentNumpadComponent,
    PaymentOrderPopupComponent,
  ],
  imports: [
    CommonModule,
    AuthorizedLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MessagePopupModule,
    NumpadModule,
    NgxMaskModule.forRoot(),
    LoaderPopupModule,
    IconModule,
  ],
  exports: [PaymentComponent],
})
export class PaymentModule {}
