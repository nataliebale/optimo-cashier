import { LocalStorageService } from './../../services/local-storage.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { MainProcessService } from '../../core/services/main-process/main-process.service';
import { Subject } from 'rxjs';
import { takeUntil, filter, switchMap } from 'rxjs/operators';
import { IOperator } from '../../../../shared/types/IOperator';
import {
  BurgerMenuDialogComponent,
  MenuDialogData,
} from '../../shared-components/popups/burger-menu-dialog/burger-menu-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OptimoProductType } from '../../../../shared/enums/OptimoProductType';
import { MessagePopupComponent } from '../../shared-components/popups/message-popup/message-popup.component';
import { IResult } from '../../../../shared/types/IResult';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  isOdinInitedBoolean: boolean;
  selectedOperator: IOperator;
  activeShiftOperator: IOperator;
  step: 'operators-list' | 'pincode' = 'operators-list';

  private _sync$ = new Subject<void>();
  readonly sync$ = this._sync$.asObservable();

  private _resetPincode$ = new Subject<void>();
  readonly resetPincode$ = this._resetPincode$.asObservable();

  private unsubscribe$ = new Subject<void>();
  public get isHorecaMode(): boolean {
    return this.odin?.settings?.productType === OptimoProductType.HORECA;
  }
  constructor(
    private odin: MainProcessService,
    private router: Router,
    private dialog: MatDialog,
    private storage: LocalStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkOperatorShift();

    // todo
    this.storage.set('checkNumber', 1);
    this.storage.set('checks', [{ id: 1, products: [] }]);
    this.storage.set('activeCheck', { id: 1 });
    this.storage.set('firstShift', true);
    this.storage.set('entitySwitcher', 'საცალო გაყიდვები');
  }

  onSync(): void {
    this._sync$.next();
    this.step = 'operators-list';
  }

  onOperatorChange(operator: IOperator): void {
    this.selectedOperator = operator;
    this.step = 'pincode';
    console.log('selected operator: ', this.selectedOperator);
    this._resetPincode$.next();
  }

  onPincodeFilled(pincode: string): void {
    // if (
    //   this.isHorecaMode &&
    //   !this.activeShiftOperator &&
    //   !this.selectedOperator.permissions.canOpenShift
    // ) {
    //   this.dialog.open(MessagePopupComponent, {
    //     width: '500px',
    //     data: {
    //       message: 'ცვლა  არ არის გახსნილი, დაუკავშირდი მენეჯერს.',
    //       success: false,
    //     },
    //   });
    //   this._resetPincode$.next();
    //   return;
    // }
    this.odin
      .operatorLogIn(this.selectedOperator.id, pincode)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: IResult<boolean>) => {
        if (response.data) {
          this.router.navigate([this.odin.mainPageUrl]);
        } else {
          this._resetPincode$.next();
          if (this.isHorecaMode && response.err.name === 'OperatorHasNoPermissionException') {
            this.dialog.open(MessagePopupComponent, {
              width: '500px',
              data: {
                message: 'ცვლა არ არის გახსნილი, დაუკავშირდი მენეჯერს.',
                success: false,
              },
            });
            this._resetPincode$.next();
            return;
          }
        }
      });
  }

  onBurgerMenuClick(): void {
    this.dialog
      .open(BurgerMenuDialogComponent, {
        width: '870px',
        panelClass: 'dashboard-Functions-popup',
        data: {
          unauthorized: true,
        } as MenuDialogData,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          console.log(result, window[result.methodName]);
          this[result.methodName]();
        }
      });
  }

  private checkOperatorShift(): void {
    this.odin
      .getShift()
      .pipe(
        filter(({ data }) => !!data),
        switchMap(({ data }) => this.odin.getOperator(data.startOperatorId)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(({ data }) => {
        if (data) {
          this.selectedOperator = data;
          this.activeShiftOperator = data;
          this.storage.set('operator-data', data); // todo
          if (!this.isHorecaMode) {
            this.step = 'pincode';
          }
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this._sync$.complete();
    this._resetPincode$.complete();
  }
}
