import { takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Inject,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';
import { DialogPopupComponent, DialogPopupData } from '../dialog-popup/dialog-popup.component';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { Router } from '@angular/router';
import { IShift } from '../../../../../shared/types/IShift';
import { LocalStorageService } from '../../../services/local-storage.service';
import { IOperator } from '../../../../../shared/types/IOperator';
import { OptimoProductType } from '../../../../../shared/enums/OptimoProductType';
import { ISpaceWithActiveChecks } from '../../../../../shared/types/ISpaceWithActiveChecks';

export interface MenuDialogData {
  selectedSpace?: ISpaceWithActiveChecks;
  entityButton?: 'საცალო გაყიდვები';
  canReceivePurchaseOrders?: true;
  shift?: Observable<IShift>;
  updateIsAvaliable?: boolean;
  unauthorized?: boolean;
  forShiftStart?: boolean;
}

@Component({
  selector: 'app-burger-menu-dialog',
  templateUrl: './burger-menu-dialog.component.html',
  styleUrls: ['./burger-menu-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BurgerMenuDialogComponent implements OnInit, OnDestroy {
  @ViewChild('shoutDownTitle', { static: true })
  shoutDownTitleRef: TemplateRef<any>;

  shiftStatus: any;
  private unsubscribe$ = new Subject<void>();
  operatorData: IOperator;
  public get isHorecaMode(): boolean {
    return this.odin?.settings?.productType === OptimoProductType.HORECA;
  }
  constructor(
    public dialogRef: MatDialogRef<BurgerMenuDialogComponent>,
    private odin: MainProcessService,
    @Inject(MAT_DIALOG_DATA) public data: MenuDialogData,
    private dialog: MatDialog,
    private router: Router,
    private _storage: LocalStorageService
  ) {}

  getOperatorData() {
    this.operatorData = this._storage.get('operator-data');
    console.log('operator data: ', this.operatorData);
  }

  ngOnInit(): void {
    this.getOperatorData();
    this.data.shift?.pipe(takeUntil(this.unsubscribe$)).subscribe((result) => {
      this.shiftStatus = result;
    });
  }

  onShutDown(): void {
    this.dialog
      .open(DialogPopupComponent, {
        width: '497px',
        data: {
          title: this.shoutDownTitleRef,
          hideClose: true,
          declineLabel: 'გაუქმება',
          approveLabel: 'გათიშვა',
        } as DialogPopupData,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          console.log('Shutting down');
          this.odin.shutDown().pipe(takeUntil(this.unsubscribe$)).subscribe();
        }
      });
  }

  // onBurgerMenuActionClick(methodName: object) {
  //   this.dialogRef.close(methodName);
  // }

  onOrdersButtonClick() {
    this.dialogRef.close();
    this.router.navigate(['/orders']);
  }

  onOrderHistoryButtonClick() {
    this.dialogRef.close();
    this.router.navigate(['/order-history']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
