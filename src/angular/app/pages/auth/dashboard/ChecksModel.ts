import { ChangeDetectorRef, TemplateRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map, switchMap, tap, takeUntil } from 'rxjs/operators';
import { EPadAction } from '../../../../../shared/types/EPadAction';
import { ICheck } from '../../../../../shared/types/ICheck';
import { ICheckAndProductRequest } from '../../../../../shared/types/ICheckAndProductRequest';
import { ICheckItem } from '../../../../../shared/types/ICheckItem';
import { ICreateCheckRequest } from '../../../../../shared/types/ICreateCheckRequest';
import { IGuestsDetails } from '../../../../../shared/types/IGuestsDetails';
import { IOperator } from '../../../../../shared/types/IOperator';
import { IProductPropChange } from '../../../../../shared/types/IProductPropChange';
import { IRemoveCheckAction } from '../../../../../shared/types/IRemoveCheckAction';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import {
  DialogPopupComponent,
  DialogPopupData,
} from '../../../shared-components/popups/dialog-popup/dialog-popup.component';
import { GuestsDetailsComponent } from '../../../shared-components/popups/guests-details/guests-details.component';
import {
  InputDialogComponent,
  InputDialogData,
} from '../../../shared-components/popups/input-dialog/input-dialog.component';
import * as fromState from '../../../state';
import * as checkActions from '../../../state/check/check.actions';
import { OptimoProductType } from '../../../../../shared/enums/OptimoProductType';
import { EventBusService, Event } from '../../../core/services/event-bus.service';
import { IRemoveCheckRequest } from '../../../../../shared/types/IRemoveCheckItemRequest';
import { SyncLoadingPopupComponent } from '../../../shared-components/popups/sync-loading-popup/sync-loading-popup.component';
import { ChangeTableComponent } from './change-table/change-table.component';
import { ITableWithStatus } from '../../../../../shared/types/ITableWithStatus';
import { IResult } from '../../../../../shared/types/IResult';
import { ISettings } from '../../../../../shared/types/ISettings';
import { ChangeOperatorComponent } from '../../../shared-components/popups/change-operator/change-operator.component';

export abstract class ChecksModel implements OnInit, OnDestroy {
  @ViewChild('exhaustionTitle', { static: true })
  exhaustionTitleRef: TemplateRef<any>;

  @ViewChild('exhaustionMessage', { static: true })
  exhaustionMessageRef: TemplateRef<any>;

  private _canInitialize = false;
  private _canActivateCheck = true;
  public get isHorecaMode(): boolean {
    return this._mainProcessService?.settings?.productType === OptimoProductType.HORECA;
  }

  showChecksBlock: boolean;
  checks: ICheck[];
  activeCheck: ICheck;
  activeCheckProducts: ICheckItem[];
  activeProduct: ICheckItem;
  activeCheckTotalPrice: number;
  activeCheckBasketTotalPrice: number;
  activeCheckTaxAmount: number;
  selectedTableName: string;
  canDeleteByPass: string | boolean;
  OTP: string = null; // One Time Passwort
  collapseNumpad: boolean;
  operatorData: IOperator = this._storage.get('operator-data');
  unsubscribe$ = new Subject<void>();
  globalTaxRate: number;
  createCheckInProgress = false;
  checkTaxRateIsOff = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    protected _store: Store<fromState.AppState>,
    protected _cd: ChangeDetectorRef,
    protected _router: Router,
    protected _dialog: MatDialog,
    protected _mainProcessService: MainProcessService,
    protected _storage: LocalStorageService,
    private _eventBus: EventBusService
  ) {}

  ngOnInit(): void {
    this.initializeDataFromState();
  }

  onToggleChecksBlock(show: boolean): void {
    this.showChecksBlock = show;
  }

  onToggleNumpadCollapse(): void {
    this.collapseNumpad = !this.collapseNumpad;
  }

  private getTableNameFromUrl(): void {
    this.selectedTableName = this._activatedRoute.snapshot.queryParams['tableName'];
  }

  checkPrint() {
    this._mainProcessService.checkPreOrder().toPromise().then();
  }

  private loadChecks() {
    const tableId = this._activatedRoute.snapshot.queryParams['tableId']
      ? Number(this._activatedRoute.snapshot.queryParams['tableId'])
      : null;
    this._store.dispatch(new checkActions.LoadChecks(tableId));
  }

  productChange(productPropChangeResult: IProductPropChange) {
    const product: ICheckItem = {
      ...productPropChangeResult.activeProduct,
    };

    switch (productPropChangeResult.padAction) {
      case EPadAction.DiscountPercentage:
        let { discountRate } = productPropChangeResult.productProps;
        if (Number(discountRate) > 100) {
          discountRate = discountRate.substring(0, discountRate.length - 1);
          productPropChangeResult.controls.discountRate.setValue(discountRate, {
            emitEvent: false,
          });
        }
        product.discountRate = Number(discountRate);
        break;
      case EPadAction.UnitPrice:
        product.unitPrice = Number(productPropChangeResult.productProps.unitPrice);
        product.discountRate = null;
        break;
      case EPadAction.Quantity:
        this.changeQuantity(productPropChangeResult, product);
        return;
      default:
        break;
    }
    this._store.dispatch(new checkActions.UpdateProduct(product));
  }

  private changeQuantity(productPropChangeResult: IProductPropChange, product: ICheckItem) {
    if (
      !product.isReceipt &&
      Number(productPropChangeResult.productProps.quantity) > product.quantityInStock &&
      !this.isHorecaMode
    ) {
      this._dialog
        .open(DialogPopupComponent, {
          width: '496px',
          data: {
            title: this.exhaustionTitleRef,
            message: this.exhaustionMessageRef,
            approveLabel: 'გაგრძელება',
            declineLabel: 'განახლება',
            hideClose: true,
          } as DialogPopupData,
        })
        .afterClosed()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result) => {
          if (result) {
            this._store.dispatch(
              new checkActions.UpdateProduct(
                Object.assign({}, product, {
                  quantity: Number(productPropChangeResult.productProps.quantity),
                })
              )
            );
          } else {
            let { quantity } = productPropChangeResult.productProps;
            quantity = quantity.substring(0, quantity.length - 1);
            productPropChangeResult.controls.quantity.setValue(quantity, {
              emitEvent: false,
            });
          }

          // false means sync
          if (result === false) {
            this.openSyncPopup();
          }
        });
    } else {
      this._store.dispatch(
        new checkActions.UpdateProduct(
          Object.assign({}, product, {
            quantity: Number(productPropChangeResult.productProps.quantity),
          })
        )
      );
    }
  }

  private openSyncPopup(): void {
    this._dialog.open(SyncLoadingPopupComponent, {
      width: '500px',
    });
  }

  private getChecks() {
    this._store
      .pipe(select(fromState.getChecks), takeUntil(this.unsubscribe$))
      .subscribe((checkResult: ICheck[]) => {
        if (checkResult.length && this._canActivateCheck) {
          const activeCheck: ICheck = this.activeCheck
            ? checkResult.find((check) => check.id === this.activeCheck.id)
            : checkResult[0];
          this.selectCheck(activeCheck ? activeCheck.id : checkResult[0].id);
        }
        this.checks = checkResult;
        this._cd.markForCheck();
      });
  }

  private getCreateCheckInProgress() {
    this._store
      .pipe(select(fromState.getCreateCheckInProgress), takeUntil(this.unsubscribe$))
      .subscribe((value: boolean) => {
        this.createCheckInProgress = value;
      });
  }

  private getActiveCheck() {
    this._store
      .pipe(select(fromState.getActiveCheck), takeUntil(this.unsubscribe$))
      .subscribe((activeCheckResult: ICheck) => {
        this.activeCheck = activeCheckResult;
        if (this.isHorecaMode) {
          this.loadTaxRate();
        }
        this._cd.markForCheck();
      });
  }

  private getCanActivateCheck() {
    this._store
      .pipe(select(fromState.getCanActivateCheck), takeUntil(this.unsubscribe$))
      .subscribe((canActivateCheckResult: boolean) => {
        this._canActivateCheck = canActivateCheckResult;
      });
  }

  private getActiveCheckProducts() {
    this._store
      .pipe(select(fromState.getActiveCheckProducts), takeUntil(this.unsubscribe$))
      .subscribe((activeCheckProductsResult: ICheckItem[]) => {
        // console.log('dev => active products:', activeCheckProductsResult);
        this.activeCheckProducts = activeCheckProductsResult;
        this._cd.markForCheck();
      });
  }

  private listenActiveProduct(): void {
    this.getActiveProduct()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((activeProductResult: ICheckItem) => {
        this.activeProduct = activeProductResult;
        this._cd.markForCheck();
      });
  }

  getActiveProduct(): Observable<ICheckItem> {
    return this._store.pipe(select(fromState.getActiveProduct));
  }

  private getActiveCheckTotalPrice() {
    this._store
      .pipe(select(fromState.getTotalPrice), takeUntil(this.unsubscribe$))
      .subscribe((activeCheckTotalPriceResult: number) => {
        this.activeCheckTotalPrice = activeCheckTotalPriceResult;
        this._cd.markForCheck();
      });
  }

  private getActiveCheckBasketTotalPrice() {
    this._store
      .pipe(select(fromState.getBasketTotalPrice), takeUntil(this.unsubscribe$))
      .subscribe((activeCheckBasketTotalPriceResult: number) => {
        this.activeCheckBasketTotalPrice = activeCheckBasketTotalPriceResult;
        this._cd.markForCheck();
      });
  }

  private getActiveCheckTaxAmount() {
    this._store
      .pipe(select(fromState.getTaxAmount), takeUntil(this.unsubscribe$))
      .subscribe((activeCheckTaxAmountResult: number) => {
        this.activeCheckTaxAmount = activeCheckTaxAmountResult;
        this._cd.markForCheck();
      });
  }

  getNewCheckRequestModel(): ICreateCheckRequest {
    let model: ICreateCheckRequest = {};
    if (this._activatedRoute.snapshot.queryParams['tableId']) {
      model = {
        guestCount: Number(this._activatedRoute.snapshot.queryParams['numberOfGuests']),
        tableId: Number(this._activatedRoute.snapshot.queryParams['tableId']),
      };
    }
    return model;
  }

  deleteCheck(id: number) {
    const tableId = this._activatedRoute.snapshot.queryParams['tableId']
      ? Number(this._activatedRoute.snapshot.queryParams['tableId'])
      : null;
    if (this.activeCheck.id === id) {
      const newActiveCheck: ICheck = this.checks.find((el) => el.id !== id);
      const removeCheckAction: IRemoveCheckAction = {
        checkId: id,
        tableId: tableId,
        loadCheckAfterRemove: !newActiveCheck ? false : true,
        navigateToSpacesPage: !!!newActiveCheck,
      };
      this._store.dispatch(new checkActions.RemoveCheck(removeCheckAction));
      if (newActiveCheck) {
        this.selectCheck(newActiveCheck.id);
      }
    } else {
      const removeCheckAction: IRemoveCheckAction = {
        checkId: id,
        tableId: tableId,
        loadCheckAfterRemove: true,
        navigateToSpacesPage: false,
      };
      this._store.dispatch(new checkActions.RemoveCheck(removeCheckAction));
    }
    this.onToggleChecksBlock(false);
  }

  selectCheck(id: number) {
    this._store.dispatch(new checkActions.SetActiveCheck(id));
    this.onToggleChecksBlock(false);
  }

  addCheck() {
    if (this.checks && this.checks.length >= 20) {
      return;
    }
    this._store.dispatch(new checkActions.AddNewCheck(this.getNewCheckRequestModel()));
    this.onToggleChecksBlock(false);
  }

  addProduct(product: ICheckItem) {
    if (!this.checks.length) {
      if (this.createCheckInProgress) {
        return;
      }
      this.addProductAfterAddingCheck(product);
      return;
    }

    const activeProductInBasket = this.activeCheckProducts.find((element) => {
      return element.stockItemId === product.stockItemId;
    });

    // console.log('dev => ChecksModel => addProduct => product', product);

    if (
      !product.isReceipt &&
      !this.isHorecaMode &&
      ((activeProductInBasket &&
        activeProductInBasket?.quantity + product.quantity > product.quantityInStock) ||
        product.quantityInStock <= 0)
    ) {
      this.openExhaustionPopup(activeProductInBasket, product);
      return;
    }
    this._store.dispatch(new checkActions.AddProduct(product));
  }

  private openExhaustionPopup(productInBasket: ICheckItem, product: ICheckItem) {
    // console.log('dev => ChecksModel => openExhaustionPopup => product', product);
    if (!product.isReceipt) {
      this._dialog
        .open(DialogPopupComponent, {
          width: '496px',
          data: {
            title: this.exhaustionTitleRef,
            message: this.exhaustionMessageRef,
            approveLabel: 'გაგრძელება',
            declineLabel: 'განახლება',
            hideClose: true,
          } as DialogPopupData,
        })
        .afterClosed()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result) => {
          if (result) {
            this._store.dispatch(new checkActions.AddProduct(product));
            return;
          }

          // false means sync
          if (result === false) {
            this.openSyncPopup();
          }
        });
    } else {
      this._store.dispatch(new checkActions.AddProduct(product));
      return;
    }
  }

  addProductAfterAddingCheck(product: ICheckItem) {
    const activeProductInBasket = this.activeCheckProducts.find((element) => {
      return element.stockItemId === product.stockItemId;
    });

    const checkAndProductRequest: ICheckAndProductRequest = {
      checkRequest: this.getNewCheckRequestModel(),
      product: product,
    };

    if (
      !product.isReceipt &&
      !this.isHorecaMode &&
      ((activeProductInBasket &&
        activeProductInBasket?.quantity + product.quantity > product.quantityInStock) ||
        product.quantityInStock <= 0)
    ) {
      this.openExhaustionPopupWithCheck(checkAndProductRequest, product);
      return;
    }
    this._store.dispatch(new checkActions.AddCheckAndProduct(checkAndProductRequest));
  }

  private openExhaustionPopupWithCheck(
    checkAndProductRequest: ICheckAndProductRequest,
    product: ICheckItem
  ) {
    if (!checkAndProductRequest.product.isReceipt) {
      this._dialog
        .open(DialogPopupComponent, {
          width: '496px',
          data: {
            title: this.exhaustionTitleRef,
            message: this.exhaustionMessageRef,
            approveLabel: 'გაგრძელება',
            declineLabel: 'განახლება',
            hideClose: true,
          } as DialogPopupData,
        })
        .afterClosed()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result) => {
          if (result) {
            this._store.dispatch(new checkActions.AddCheckAndProduct(checkAndProductRequest));
            return;
          }

          // false means sync
          if (result === false) {
            this.openSyncPopup();
          }
        });
    } else {
      this._store.dispatch(new checkActions.AddCheckAndProduct(checkAndProductRequest));
      return;
    }
  }

  activateProduct(product: ICheckItem): void {
    this._store.dispatch(new checkActions.AddActiveProduct(product));
  }

  clearCurrentCheck() {
    if (!this.operatorData?.permissions?.canDeleteFromBasket) {
      this._dialog
        .open(InputDialogComponent, {
          width: '558px',
          data: {
            title: 'ჩეკის გასუფთავება',
            subTitle: 'კოდი',
            inputPlaceholder: 'ჩაწერეთ კოდი',
            approveLabel: 'გაგრძელება',
            onApproveFunction: this.getDeleteCheckPermission.bind(this),
            maxLength: 6,
          } as InputDialogData,
        })
        .afterClosed()
        .pipe(
          filter((r) => r),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(() => {
          this._store.dispatch(new checkActions.ClearCheck(this.activeCheck.id));
          this._mainProcessService.submitPrivilegeElevationPassword(this.OTP).toPromise().then();
        });
    } else {
      this._store.dispatch(new checkActions.ClearCheck(this.activeCheck.id));
    }
  }

  openGuestsDetails() {
    const guestsDetails: IGuestsDetails = {
      approveLabel: 'ცვლილების შენახვა',
      declineLabel: 'გაუქმება',
      title: 'სტუმრების რაოდენობა',
      value: Number(this._activatedRoute.snapshot.queryParams['numberOfGuests']),
    };
    this._dialog
      .open(GuestsDetailsComponent, {
        width: '500px',
        data: guestsDetails,
        position: {
          top: '20%',
        },
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((number: number) => {
        if (number) {
          this._store.dispatch(new checkActions.ChangeGuestNumber(number));
          this._router.navigate(['/dashboard'], {
            queryParams: {
              ...this._activatedRoute.snapshot.queryParams,
              numberOfGuests: number,
            },
          });
        }
      });
  }

  deleteCurrentCheck() {
    this.onDeleteCheck(this.activeCheck.id);
  }

  onDeleteCheck(checkId: number): void {
    if (
      this._mainProcessService.settings.productType === OptimoProductType.Retail &&
      this.checks.length === 1
    ) {
      return;
    }

    if (!this.operatorData?.permissions?.canDeleteBasket) {
      this._dialog
        .open(InputDialogComponent, {
          width: '558px',
          data: {
            title: 'ჩეკის წაშლა',
            subTitle: 'კოდი',
            inputPlaceholder: 'ჩაწერეთ კოდი',
            approveLabel: 'გაგრძელება',
            onApproveFunction: this.getDeleteCheckPermission.bind(this),
            maxLength: 6,
          } as InputDialogData,
        })
        .afterClosed()
        .pipe(
          filter((r) => r),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(() => {
          this.deleteCheck(checkId);
          setTimeout(() => {
            this._mainProcessService.submitPrivilegeElevationPassword(this.OTP).toPromise().then();
          }, 2000);
        });
    } else {
      this.deleteCheck(checkId);
    }
  }

  private getDeleteCheckPermission(code: string): Observable<boolean> {
    return this._mainProcessService.requestPrivelegeElevationByPassword(code).pipe(
      map(({ data }) => {
        if (data) {
          this.OTP = code;
        }
        return data;
      })
    );
  }

  changeTaxRate() {
    if (this.checkTaxRateIsOff) {
      this._mainProcessService
        .getSettings()
        .toPromise()
        .then((response: IResult<ISettings>) => {
          const taxRate = response?.data?.taxRate || 0;
          this._store.dispatch(new checkActions.ChangeTaxRate(taxRate));
        });
    } else {
      this._store.dispatch(new checkActions.ChangeTaxRate(0));
    }
  }

  changeOperator() {
    this._dialog
      .open(ChangeOperatorComponent, {
        width: '557px',
        data: {
          currentOperatorId: this.activeCheck.operatorId,
        },
      })
      .afterClosed()
      .toPromise()
      .then(() => {
        this._store.dispatch(new checkActions.LoadActiveCheck(null));
      });
  }

  changeTable() {
    this._dialog
      .open(ChangeTableComponent, {
        width: '100%',
        panelClass: 'table-change-dialog-popup',
        disableClose: true,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((table: ITableWithStatus) => {
        if (table) {
          this._router.navigate(['/dashboard'], {
            queryParams: {
              ...this._activatedRoute.snapshot.queryParams,
              tableName: table.name,
              tableId: table.id,
            },
          });
          this.selectedTableName = table.name;
          this._store.dispatch(new checkActions.ChangeCheckTable(table.id));
        }
      });
  }

  deleteProduct(product: ICheckItem): void {
    if (this.canDeleteByPass || this.operatorData.permissions.canDeleteFromBasket) {
      const removeProductRequest: IRemoveCheckRequest = {
        itemId: product.stockItemId,
      };
      product.stockItemIMEI ? (removeProductRequest.stockItemIMEI = product.stockItemIMEI) : null;
      this._store.dispatch(new checkActions.RemoveProduct(removeProductRequest));
      return;
    }

    this._dialog.open(InputDialogComponent, {
      width: '558px',
      panelClass: 'product-delete-popup',
      data: {
        title: 'პროდუქტის წაშლა',
        subTitle: 'კოდი',
        inputPlaceholder: 'ჩაწერეთ კოდი',
        approveLabel: 'დადასტურება',
        onApproveFunction: this.getProductDeletePermission.bind(this),
        maxLength: 6,
      } as InputDialogData,
    });
  }

  private getProductDeletePermission(code: string) {
    return this._mainProcessService.requestPrivelegeElevationByPassword(code).pipe(
      map(({ data }) => {
        return data;
      }),
      tap((result) => {
        if (result) {
          this.OTP = code;
          this.collapseNumpad = true;
          this.canDeleteByPass = true;
          this._cd.markForCheck();
        }
      }),
      takeUntil(this.unsubscribe$)
    );
  }

  onEndDeleting(deleteDialogRef: TemplateRef<any>): void {
    this.getActiveCheckProducts();
    if (this.activeCheckProducts.length < 1) {
      this._mainProcessService
        .submitPrivilegeElevationPassword(this.OTP)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe();
      this.OTP = null;
      this.collapseNumpad = false;
      this.canDeleteByPass = false;
      this._cd.markForCheck();
      return;
    }

    this._dialog
      .open(DialogPopupComponent, {
        width: '500px',
        data: {
          title: deleteDialogRef,
          approveLabel: 'კი',
          declineLabel: 'არა',
          hideClose: true,
        } as DialogPopupData,
      })
      .afterClosed()
      .pipe(
        filter((r) => r),
        switchMap(() => {
          return this._mainProcessService.submitPrivilegeElevationPassword(this.OTP as string);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.OTP = null;
        this.collapseNumpad = false;
        this.canDeleteByPass = false;
        this._cd.markForCheck();
      });
  }

  private getOperatorData() {
    console.log('ChecksModel->getOperatorData->operatorData: ', this.operatorData);
    this._mainProcessService
      .getOperator(this._storage.get('operator-data').id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.operatorData = data;
        this._storage.set('operator-data', data);
        this._cd.markForCheck();
      });
  }

  private listenToSync(): void {
    this._eventBus
      .on(Event.SYNCED)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getOperatorData();
        this._cd.markForCheck();
      });
  }

  initializeCheckState() {
    this._store.dispatch(new checkActions.InitializeCheckState(null));
  }

  private checkUnsetActive(url: string) {
    const checkUnsetActiveOnthisPages = ['/space', '/login'];
    if (checkUnsetActiveOnthisPages.includes(url)) {
      this._canInitialize = true;
      this._mainProcessService.checkUnsetActive().pipe(takeUntil(this.unsubscribe$)).subscribe();
    }
  }

  loadTaxRate() {
    this._mainProcessService
      .getSettings()
      .toPromise()
      .then((response: IResult<ISettings>) => {
        const taxRate = response?.data?.taxRate || 0;
        this.globalTaxRate = taxRate;
        this.checkTaxRateIsOff =
          this.activeCheck && taxRate !== 0 && this.activeCheck.taxRate !== taxRate;
        this._cd.markForCheck();
      });
  }

  private initializeDataFromState() {
    this.listenToSync();
    this.getCanActivateCheck();
    this.getActiveCheck();
    this.loadChecks();
    this.getChecks();
    this.getActiveCheckProducts();
    this.listenActiveProduct();
    this.getActiveCheckTotalPrice();
    this.getActiveCheckBasketTotalPrice();
    this.getActiveCheckTaxAmount();
    this.getTableNameFromUrl();
    this.getCreateCheckInProgress();
    this.loadTaxRate();
  }

  ngOnDestroy(): void {
    this.checkUnsetActive(this._router.routerState.snapshot.url);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this._canInitialize) {
      this.initializeCheckState();
    }
  }
}
