import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { FocusOutModule } from '../../../core/directives/focus-out.directive';
import { AuthorizedLayoutModule } from '../../../layouts/authorized-layout/authorized-layout.module';
import { DatePickerModule } from '../../../shared-components/date-picker/date-picker.module';
import { IconModule } from '../../../shared-components/icon/icon.module';
import { NumpadComponent } from '../../../shared-components/numpad/numpad.component';
import { NumpadModule } from '../../../shared-components/numpad/numpad.module';
import { OrderHistoryDetailsComponent } from './components/order-history-details/order-history-details.component';
import { OrderHistoryFilterComponent } from './components/order-history-filter/order-history-filter.component';
import { OrderHistoryListComponent } from './components/order-history-list/order-history-list.component';
import { ReturnOrderComponent } from './components/return-order/return-order.component';
import { OrderHistoryComponent } from './containers/order-history/order-history.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FocusOutModule,
    ReactiveFormsModule,
    AuthorizedLayoutModule,
    DatePickerModule,
    IconModule,
    NgxMaskModule.forRoot(),
    NgSelectModule,
    NumpadModule,
  ],
  declarations: [
    OrderHistoryComponent,
    OrderHistoryListComponent,
    OrderHistoryDetailsComponent,
    OrderHistoryFilterComponent,
    ReturnOrderComponent,
  ],
  exports: [OrderHistoryComponent],
})
export class OrderHistoryModule {}
