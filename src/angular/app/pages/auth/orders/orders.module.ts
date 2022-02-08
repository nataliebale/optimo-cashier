import { IconModule } from './../../../shared-components/icon/icon.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { OrdersComponent } from './orders.component';
import { RouterModule } from '@angular/router';
import { OrderItemComponent } from './item/order-item.component';
import { OrderDetailComponent } from './detail/order-detail.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NumpadModule } from '../../../shared-components/numpad/numpad.module';
import { FocusOutModule } from '../../../core/directives/focus-out.directive';

@NgModule({
  declarations: [OrdersComponent, OrderItemComponent, OrderDetailComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatDialogModule,
    ReactiveFormsModule,
    NumpadModule,
    IconModule,
    FormsModule,
    FocusOutModule,
  ],
  exports: [OrdersComponent],
})
export class OrdersModule {}
