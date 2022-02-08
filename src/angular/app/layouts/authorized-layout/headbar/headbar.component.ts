import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { mapTo, startWith, switchMapTo, takeUntil, tap } from 'rxjs/operators';
import { OdinEvent } from '../../../../../shared/enums/OdinEvent';
import { OptimoProductType } from '../../../../../shared/enums/OptimoProductType';
import { SyncStatus } from '../../../../../shared/enums/SyncStatus';
import { ICheck } from '../../../../../shared/types/ICheck';
import { ICheckItem } from '../../../../../shared/types/ICheckItem';
import { ICheckUpdate } from '../../../../../shared/types/ICheckUpdate';
import { IOperator } from '../../../../../shared/types/IOperator';
import { IResult } from '../../../../../shared/types/IResult';
import { ISpaceWithActiveChecks } from '../../../../../shared/types/ISpaceWithActiveChecks';
import { ITableWithStatus } from '../../../../../shared/types/ITableWithStatus';
import { IWifiStatusModel } from '../../../../../shared/types/IWifiStatusModel';
import { Event, EventBusService } from '../../../core/services/event-bus.service';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { ShiftService } from '../../../core/services/shift.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ComFunctions } from '../../../shared-components/common-functions/common-functions';
import { DailySalesDialogComponent } from '../../../shared-components/popups/daily-sales-dialog/daily-sales-dialog.component';
import {
  InputDialogComponent,
  InputDialogData,
} from '../../../shared-components/popups/input-dialog/input-dialog.component';
import { LoaderPopupComponent } from '../../../shared-components/popups/loader-popup/loader-popup.component';
import { MessagePopupComponent } from '../../../shared-components/popups/message-popup/message-popup.component';
import { WifiPopupComponent } from '../../../shared-components/popups/wifi-popup/wifi-popup.component';
import { WithdrawalDialogComponent } from '../../../shared-components/popups/withdrawal-dialog/withdrawal-dialog.component';
import * as fromState from '../../../state';
import { Environment } from './../../../../../shared/enums/Environment';
import {
  BurgerMenuDialogComponent,
  MenuDialogData,
} from './../../../shared-components/popups/burger-menu-dialog/burger-menu-dialog.component';
import {
  DialogPopupComponent,
  DialogPopupData,
} from './../../../shared-components/popups/dialog-popup/dialog-popup.component';

@Component({
  selector: 'app-headbar',
  templateUrl: './headbar.component.html',
  styleUrls: ['./headbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadbarComponent implements OnInit, OnDestroy {
  @ViewChild('closeDayTitle', { static: true })
  closeDayTitleRef: TemplateRef<any>;

  @ViewChild('shiftPopupFooter', { static: false })
  shiftPopupFooterRef: TemplateRef<any>;

  isProduction = window.MainProcessAPI.getEnvironment() === Environment.Production.toString();
  updateIsAvaliable: boolean;
  SyncStatus = SyncStatus;
  syncStatus = SyncStatus.None;
  entitySwitcher: string;
  operator: IOperator;
  shift$ = this.shiftService.valueChanges;
  openCheck = false;
  showSpaceDropdown = false;
  showUserDropdown = false;
  selectedTable: ITableWithStatus;
  private checks: ICheck[];
  private updateData: ICheckUpdate;
  private activeCheckProducts: ICheckItem[];

  private unsubscribe$ = new Subject<void>();
  checkForUpdate$ = new Subject<void>();

  activeWifiNetwork: IWifiStatusModel;

  activeCheckId: number;

  private _openBurgerMenuForShiftStart: boolean;

  showTimeDriftPopup = false;

  @Input()
  set openBurgerMenuForShiftStart(value: boolean) {
    this._openBurgerMenuForShiftStart = value;
    if (value) {
      this.onBurgerMenuClick(true);
    }
  }

  get openBurgerMenuForShiftStart(): boolean {
    return this._openBurgerMenuForShiftStart;
  }

  @Input()
  spaces: ISpaceWithActiveChecks[];

  @Input()
  selectedTableName: string[];

  @Input()
  isOrderHistoryPage: boolean;

  @Input()
  selectedSpace: ISpaceWithActiveChecks;

  @Output()
  selectSpace = new EventEmitter<ISpaceWithActiveChecks>();

  @Input()
  deletePrivilegePassword: boolean;

  @Input()
  isPaymentPage: boolean;

  @Input()
  isHorecaMode: boolean;

  @Output()
  checksButtonClicked = new EventEmitter<void>();

  openAndStartSyncDropdown$ = new Subject<void>();

  public get isSpacesPage(): boolean {
    return !!this.selectedSpace;
  }

  constructor(
    private odin: MainProcessService,
    public dialog: MatDialog,
    private router: Router,
    private storage: LocalStorageService,
    private shiftService: ShiftService,
    private eventBus: EventBusService,
    private cdr: ChangeDetectorRef,
    private _location: Location,
    private _store: Store<fromState.AppState>,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.listenToSync();
    this.listenToCheckForUpdates();
    this.getWifiStatus();
    this.shiftService.dispatch();
    this.entitySwitcher = this.storage.get('entitySwitcher') || 'საცალო გაყიდვები';
    this.getSelectedTable();
    this.getChecks();
    this.getActiveCheck();
    this.getActiveCheckProducts();
  }

  private getChecks(): void {
    this._store
      .pipe(select(fromState.getChecks), takeUntil(this.unsubscribe$))
      .subscribe((checkResult: ICheck[]) => {
        this.checks = checkResult;
        this.cdr.markForCheck();
      });
  }

  private getActiveCheck(): void {
    this._store
      .pipe(select(fromState.getActiveCheck), takeUntil(this.unsubscribe$))
      .subscribe((activeCheckResult: ICheck) => {
        this.activeCheckId = activeCheckResult?.id;
        this.openCheck = false;
        this.cdr.markForCheck();
      });
  }

  private getActiveCheckProducts(): void {
    this._store
      .pipe(select(fromState.getActiveCheckProducts), takeUntil(this.unsubscribe$))
      .subscribe((products: ICheckItem[]) => {
        this.activeCheckProducts = products;
        this.cdr.markForCheck();
      });
  }

  private listenToSync(): void {
    this.eventBus
      .on(Event.SYNCED)
      .pipe(startWith(null), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getOperator();
        this.cdr.markForCheck();
        this.checkForUpdate$.next();
      });
  }

  selectSpaceHandler(spaceId: number) {
    const space: ISpaceWithActiveChecks = this.spaces.find((sp) => sp.id === spaceId);
    this.selectSpace.emit(space);
    this.toggleSpaceDropdown(false);
  }

  toggleSpaceDropdown(value: boolean) {
    this.showSpaceDropdown = value;
  }

  toggleUserDropdown(value: boolean) {
    // tslint:disable-next-line: deprecation
    event.preventDefault();
    this.showUserDropdown = value;
  }

  private listenToCheckForUpdates(): void {
    this.checkForUpdate$
      .pipe(switchMapTo(this.odin.checkUpdates()), takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.updateData = data;
        this.updateIsAvaliable = data.updatesAvaliable || data.rebootRequired;
        console.log('33333333333333333333, updates: ', data);
        this.cdr.markForCheck();
        this.odin.once(OdinEvent.UPDATE_DOWNLOADED, () => {}); // todo
      });
  }

  private getOperator(): void {
    this.odin
      .getOperator(this.storage.get('operator-data').id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.operator = data;
        this.storage.set('operator-data', data); // todo
        this.cdr.markForCheck();
      });
  }

  public openAndStartSyncDropdown(): void {
    this.openAndStartSyncDropdown$.next();
  }

  onSync(): void {
    this.odin.once(OdinEvent.UPDATE_DOWNLOADED, () => {});
    this.syncStatus = SyncStatus.Progress;
    this.cdr.markForCheck();
    this.odin
      .sync()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ({ data }) => {
          console.log('this result in sync: ', data);
          if (data) {
            this.syncStatus = SyncStatus.Success;
            this.cdr.markForCheck();
            this.clearSyncStatus();
            this.eventBus.dispatch(Event.SYNCED);
          } else {
            this.syncStatus = SyncStatus.Error;
            this.cdr.markForCheck();
            this.clearSyncStatus();
          }
        },
        () => {
          this.syncStatus = SyncStatus.Error;
          this.cdr.markForCheck();
          this.clearSyncStatus();
        }
      );
  }

  private clearSyncStatus(): void {
    setTimeout(() => {
      try {
        this.syncStatus = SyncStatus.None;
        this.cdr.markForCheck();
      } catch {}
    }, 3000);
  }

  onClickUpdate(): void {
    this.dialog
      .open(DialogPopupComponent, {
        width: '560px',
        data: {
          // title: 'განახლება',
          message: 'განახლების დასრულებამდე ვერ შეძლებთ მუშაობას სისტემაში',
          approveLabel: 'განახლება',
          declineLabel: 'უკან',
          hideClose: true,
        } as DialogPopupData,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.installUpdates();
        }
      });
  }

  private installUpdates(): void {
    if (this.updateData.updatesAvaliable) {
      this.odin.installUpdate().pipe(takeUntil(this.unsubscribe$)).subscribe();
    }

    if (this.updateData.rebootRequired) {
      this.odin.reboot().pipe(takeUntil(this.unsubscribe$)).subscribe();
    }
  }

  openWifiPopup(): void {
    this.dialog
      .open(WifiPopupComponent, {
        width: '560px',
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getWifiStatus();
      });
  }

  openShiftPopup(isShiftOpen: boolean): void {
    console.log('openShiftPopup -> isShiftOpen', isShiftOpen);

    const opener = () => {
      this.dialog.open(InputDialogComponent, {
        width: '558px',
        data: {
          title: isShiftOpen ? 'ცვლის დასრულება' : 'ცვლის დაწყება',
          subTitle: 'სალაროში არსებული თანხა',
          // inputPlaceholder: 'ჩაწერეთ თანხა',
          onApproveFunction: this.changeShiftStatus.bind(this),
          approveLabel: 'დადასტურება',
          footerTemp: this.shiftPopupFooterRef,
        } as InputDialogData,
      });
    };

    if (isShiftOpen) {
      this.odin
        .hasActiveChecks()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(({ data }) => {
          if (data) {
            this.openShiftWorning();
          } else {
            opener();
          }
        });
    } else {
      opener();
    }
  }

  private getWifiStatus(): void {
    this.odin
      .getWifiStatus()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.activeWifiNetwork = result.data;
        this.cdr.markForCheck();
      });
  }

  private openShiftWorning(): void {
    this.dialog.open(MessagePopupComponent, {
      width: '500px',
      data: {
        message: 'ცვლის დახურვა შესაძლებელია ღია შეკვეთების დახურვის შემდეგ',
        success: false,
      },
    });
  }

  private changeShiftStatus(cash: number) {
    const request = this.shiftService.currentShift
      ? this.odin.finishShift(cash)
      : this.odin.startShift(cash);
    const logOutIfShiftWillClose =
      this.shiftService.currentShift &&
      this.odin.settings?.productType === OptimoProductType.HORECA;

    return (request as Observable<any>).pipe(
      tap((result) => {
        if (result.err && result.err.name === 'ShiftStartedByOthersException') {
          this.dialog.open(MessagePopupComponent, {
            width: '500px',
            data: {
              message: 'თქვენ არ გაქვთ სხვის მიერ გახსნილი ცვლის დახურვის უფლება.',
              success: false,
            },
          });
          return;
        }
        this.storage.set('checkNumber', JSON.stringify(1));
        this.storage.set('checks', JSON.stringify([{ id: 1, products: [] }]));
        this.storage.set('activeCheck', JSON.stringify({ id: 1 }));
        // if "this.odin.startShift(cash)" returns itself shift, than this is not needed
        this.shiftService.setValue(result.data);
        if (logOutIfShiftWillClose) {
          this.onLogout();
        }
      }),
      mapTo(true),
      takeUntil(this.unsubscribe$)
    );
  }

  // todo
  onSwitchEntity(): void {
    if (this.entitySwitcher === 'ი/პ გაყიდვები') {
      this.entitySwitcher = 'საცალო გაყიდვები'; // 0
    } else {
      this.entitySwitcher = 'ი/პ გაყიდვები'; // 1
    }
    this.cdr.markForCheck();
    this.storage.set('entitySwitcher', this.entitySwitcher);
    this.eventBus.dispatch(Event.SWITCH_ENTITY, this.entitySwitcher);
    this.router.navigate(['/dashboard'], { queryParams: this.activatedRoute.snapshot.queryParams });
  }

  onBurgerMenuClick(forShiftStart?: boolean): void {
    this.dialog
      .open(BurgerMenuDialogComponent, {
        width: '870px',
        panelClass: 'dashboard-Functions-popup',
        data: {
          selectedSpace: this.selectedSpace,
          entityButton: this.entitySwitcher,
          canReceivePurchaseOrders: this.operator?.permissions?.canReceivePurchaseOrders,
          shift: this.shift$,
          updateIsAvaliable: this.updateIsAvaliable,
          forShiftStart: forShiftStart,
        } as MenuDialogData,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          console.log(result, window[result.methodName]);
          result.params ? this[result.methodName](...result.params) : this[result.methodName]();
        }
      });
  }

  onOpenDailySalesDialog(): void {
    this.dialog.open(DailySalesDialogComponent, {
      width: '705px',
    });
  }

  onOpenWithdrawalPopup(): void {
    this.dialog
      .open(WithdrawalDialogComponent, {
        width: '560px',
        panelClass: 'withdrawal-dialog-popup',
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
        }
      });
  }

  onCloseDay(): void {
    this.dialog
      .open(DialogPopupComponent, {
        width: '560px',
        data: {
          title: this.closeDayTitleRef,
          approveLabel: 'დღის დახურვა',
          declineLabel: 'გაუქმება',
          hideClose: true,
        },
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.closeDay();
        }
      });
  }

  private closeDay(): void {
    this.dialog
      .open(LoaderPopupComponent, {
        width: '520px',
        data: {
          message: 'დღის დახურვა',
          observable$: this.odin.closeDay(),
        },
        disableClose: true,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: any) => {
        this.dialog.open(MessagePopupComponent, {
          width: '500px',
          data: {
            message: !result.err
              ? 'დღე წარმატებით დაიხურა'
              : ComFunctions.generateErrorText(result),
            success: !result.err,
          },
        });
        if (result) {
          setTimeout(() => {
            this.dialog.closeAll();
          }, 2000);
        }
      });
  }

  onLogout(): void {
    this.odin
      .operatorLogOut()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: IResult<void>) => {
        console.log('onLogout: ', result);
        if (result.err) {
          let message = result.err.message;
          if (result.err.name === 'OperatorHasActiveChecksException') {
            message = 'სისტემიდან გამოსვლამდე აუცილებელია აქტიური ჩეკების დახურვა';
          }
          if (result.err.name === 'ShiftNotClosedException') {
            message = 'სისტემიდან გამოსვლამდე აუცილებელია ცვლის დახურვა';
          }
          this.dialog.open(MessagePopupComponent, {
            width: '500px',
            data: {
              message: message,
              success: false,
            },
          });
          return;
        }
        this.router.navigate(['/login']);
      });
  }

  onSwitchUser(): void {
    this.odin
      .switchOperator()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: IResult<void>) => {
        if (result.err) {
          let message = result.err.message;
          if (result.err.name === 'OperatorNotAuthedException') {
            message = 'ოპერატორი არ არის ავტორიზებული';
          }
          this.dialog.open(MessagePopupComponent, {
            width: '500px',
            data: {
              message: message,
              success: false,
            },
          });
          return;
        }
        this.router.navigate(['/login']);
      });
  }

  getSelectedTable() {
    this._store
      .pipe(takeUntil(this.unsubscribe$), select(fromState.getSelectedTable))
      .subscribe((table: ITableWithStatus) => {
        this.selectedTable = table;
      });
  }

  onBack(): void {
    // console.log('dev => router state is', this.router.routerState);
    this._location.back();
  }

  goToMainPageUrl() {
    this.router.navigate([this.odin.mainPageUrl]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.checkForUpdate$.complete();
    this.openAndStartSyncDropdown$.complete();
  }
}
