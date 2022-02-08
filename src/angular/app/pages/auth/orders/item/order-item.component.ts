import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IPurchaseOrder } from '../../../../../../shared/types/IPurchaseOrder';
import { IPurchaseOrderLine } from '../../../../../../shared/types/IPurchaseOrderLine';
import { sumBy } from 'lodash-es';
import { OrderDetailComponent } from '../detail/order-detail.component';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderItemComponent implements OnInit {
  @Input()
  order: IPurchaseOrder;

  @Input()
  overtime: boolean;

  totalQuantity: string;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.calculateTotalQuantity();
  }

  calculateTotalQuantity(): void {
    if (this.order.purchaseOrderLines.length === 1) {
      const order = this.order.purchaseOrderLines[0];
      this.totalQuantity = `${order.orderedQuantity} ${this.getUnitOfMeasurement(order)}`;
      return;
    }

    this.totalQuantity = `${sumBy(
      this.order.purchaseOrderLines,
      (line) => line.orderedQuantity
    )} ც`;
  }

  onClick(): void {
    // const innerWidth = window.innerWidth >= 1366 ? '1210px' : '1002px';
    this.dialog.open(OrderDetailComponent, {
      width: '1026px',
      panelClass: 'order-detail-popup',
      data: this.order,
    });
    // .afterClosed()
    // .pipe(takeUntil(this.unsubscribe$))
    // .subscribe(result => {
    //   if (result) {
    //     this.refresh.emit();
    //   }
    // });
  }

  getUnitOfMeasurement(order: IPurchaseOrderLine): string {
    switch (order?.stockItem?.unitOfMeasurement) {
      case 1:
        return 'ც';
      case 2:
        return 'კგ';
      case 3:
        return 'ლ';
      case 4:
        return 'მ';
      case 5:
        return 'მ²';
      default:
        return '';
    }
  }
}
