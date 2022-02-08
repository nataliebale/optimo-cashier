import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PaymentMethods } from '../../../../../shared/enums/PaymentMethods';

@Component({
  selector: 'app-daily-sales-dialog',
  templateUrl: './daily-sales-dialog.component.html',
  styleUrls: ['./daily-sales-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailySalesDialogComponent implements OnInit {
  dailySales: any;
  private unsubscribe$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<DailySalesDialogComponent>,
    private odin: MainProcessService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getDailySalesData();
  }

  getDailySalesData() {
    this.odin
      .getShiftTotalSale()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        if (data) {
          this.dailySales = data;
          console.log('Daily sales: ', data);
          this.cdr.markForCheck();
        }
      });

    this.odin
      .getTransactionHistoryList(
        {
          from: '2020-12-22',
          to: '2020-12-23',
          searchStr: '',
        },
        false
      )
      .subscribe((resp) => {
        console.log('dev => getTransactionList => response', resp);
      });

    this.odin.getTransactionDetails(1, false).subscribe((resp) => {
      console.log('dev => getTransactionDetails => response', resp);
    });
  }
}
