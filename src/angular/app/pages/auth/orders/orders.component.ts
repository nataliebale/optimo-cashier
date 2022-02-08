import { formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { differenceInCalendarDays, endOfToday } from 'date-fns';
import { from, Subject } from 'rxjs';
import { groupBy, mergeMap, takeUntil, toArray } from 'rxjs/operators';
import { OdinEvent } from '../../../../../shared/enums/OdinEvent';
import { IPurchaseOrder } from '../../../../../shared/types/IPurchaseOrder';
import { ITableWithStatus } from '../../../../../shared/types/ITableWithStatus';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import * as fromState from '../../../state';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OrdersComponent implements OnInit, OnDestroy {
  purchaseGroupedOrders = [];
  endOfToday = endOfToday();
  selectedTable: ITableWithStatus;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private odin: MainProcessService,
    @Inject(LOCALE_ID) private locale: string,
    private cdr: ChangeDetectorRef,
    private _store: Store<fromState.AppState>,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getPurchaseOrders();

    this.odin.on(OdinEvent.RECEIVED_ORDER_SYNCED, (data) => {
      console.log('TCL: OrdersComponent -> data', data);
      this.onRefresh();
    });
    this.getSelectedTable();
  }

  private onRefresh(): void {
    this.purchaseGroupedOrders = [];
    this.getPurchaseOrders();
  }

  getSelectedTable() {
    this._store
      .pipe(takeUntil(this.unsubscribe$), select(fromState.getSelectedTable))
      .subscribe((table: ITableWithStatus) => {
        this.selectedTable = table;
      });
  }

  private getPurchaseOrders(): void {
    this.odin
      .getPurchaseOrders('', 0, 100)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        console.log('orders: ', data);
        this.groupOrders(data);
      });
  }

  goToDashboard() {
    let queryParams = {};
    if (this.selectedTable) {
      queryParams = {
        numberOfGuests: this.selectedTable.numberOfGuests,
        tableId: this.selectedTable.id,
      };
    }
    this._router.navigate([`/dashboard`], {
      queryParams: queryParams,
    });
  }

  private groupOrders(purchaseOrders: IPurchaseOrder[]): void {
    purchaseOrders.forEach((order) => {
      (order as any).expectedReceiveDateStatus = this.getOrderDateStatus(
        new Date(order.expectedReceiveDate)
      );
    });

    //todo
    from(purchaseOrders)
      .pipe(
        groupBy((order: any) => {
          return order.expectedReceiveDateStatus;
        }),
        mergeMap((group) => group.pipe(toArray()))
      )
      .subscribe(
        (val) => {
          this.purchaseGroupedOrders.push({
            label: val[0].expectedReceiveDateStatus,
            value: val,
            collapsed: true,
          });
        },
        null,
        () => {
          console.log('groupOrders -> this.purchaseGroupedOrders', this.purchaseGroupedOrders);
          this.cdr.markForCheck();
        }
      );
  }

  private getOrderDateStatus(expectedReceiveDate: Date): string {
    const diff = differenceInCalendarDays(expectedReceiveDate, this.endOfToday);
    if (diff < 0) {
      return 'დაგვიანებული';
    }
    switch (diff) {
      case 0:
        return 'დღეს';
      case 1:
        return 'ხვალ';
      case 2:
        return 'ზეგ';
      default:
        return formatDate(expectedReceiveDate, 'd MMM yy', this.locale);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
