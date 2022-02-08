import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
// tslint:disable-next-line:max-line-length
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { EPadAction } from '../../../../../shared/types/EPadAction';
import { ICheckItem } from '../../../../../shared/types/ICheckItem';
import { IDashboardNumpadProps } from '../../../../../shared/types/IDashboardNumpadProps';
import { IResult } from '../../../../../shared/types/IResult';
import { IStockItem } from '../../../../../shared/types/IStockItem';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { ShiftService } from '../../../core/services/shift.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AssortimentsDialogComponent } from '../../../shared-components/popups/assortiments-dialog/assortiments-dialog.component';
import {
  DialogPopupComponent,
  DialogPopupData,
} from '../../../shared-components/popups/dialog-popup/dialog-popup.component';
import { NotifierPopupComponent } from '../../../shared-components/popups/notifier-popup/notifier-popup.component';
import { SyncLoadingPopupComponent } from '../../../shared-components/popups/sync-loading-popup/sync-loading-popup.component';
import * as fromState from '../../../state';
import { BarcodeScannerService } from './../../../services/barcode-scanner.service';
import { MessagePopupComponent } from './../../../shared-components/popups/message-popup/message-popup.component';
import { ChecksModel } from './ChecksModel';
import { EventBusService } from '../../../core/services/event-bus.service';

declare global {
  interface Window {
    dashboardComponent: any;
  }
}

export interface DialogData {
  products: Array<any>;
  IMEICodes: Array<any>;
  listProducts?: Array<any>;
  isIMEI: boolean;
}

export type StockItem = IStockItem & {
  discountPercentage: string;
  initialUnitPrice: number;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends ChecksModel implements OnInit, OnDestroy {
  @ViewChild('exhaustionTitle', { static: true })
  exhaustionTitleRef: TemplateRef<any>;

  @ViewChild('exhaustionMessage', { static: true })
  exhaustionMessageRef: TemplateRef<any>;

  collapseNumpad: boolean;
  shift$ = this.shiftService.valueChanges;
  activeFormGroup: FormGroup;
  maxFractionDigits = 2;

  private barCode = '';

  fakeBarcode = '';

  private _productGroup$: Subscription = new Subscription();

  dashboardNumpadProps: IDashboardNumpadProps = {
    activeAction: EPadAction.Quantity,
    control: new FormControl(),
    group: null,
    activeProduct: null,
  };

  constructor(
    odin: MainProcessService,
    storage: LocalStorageService,
    dialog: MatDialog,
    router: Router,
    cdr: ChangeDetectorRef,
    store: Store<fromState.AppState>,
    activatedRoute: ActivatedRoute,
    eventBus: EventBusService,
    private shiftService: ShiftService,
    private barcodeScanner: BarcodeScannerService,
    private _fb: FormBuilder
  ) {
    super(activatedRoute, store, cdr, router, dialog, odin, storage, eventBus);
    window.dashboardComponent = this;
  }

  submitFakeBarcode(barcode?: string) {
    this.barCode = barcode || this.fakeBarcode;
    console.log('barcode, fakeBarcode', this.barCode, this.fakeBarcode);
    this.keyDownTextField({ keyCode: 13 });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.barcodeScanner.listener
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.keyDownTextField.bind(this));
    this.barcodeScanner.startListening();
    this.shiftService.dispatch();
    this.listenActiveProductChange();
  }

  focusFormOnActiveProduct(activeProduct: ICheckItem) {
    if (!activeProduct) {
      this._productGroup$.unsubscribe();
    } else {
      if (
        !this.dashboardNumpadProps.activeProduct ||
        !(
          this.dashboardNumpadProps.activeProduct.stockItemId === activeProduct.stockItemId &&
          this.dashboardNumpadProps.activeProduct.stockItemIMEI === activeProduct.stockItemIMEI
        )
      ) {
        this._productGroup$.unsubscribe();
        this.dashboardNumpadProps = {
          ...this.dashboardNumpadProps,
          group: this._fb.group({
            quantity: activeProduct.quantity,
            unitPrice: activeProduct.unitPrice,
            discountRate: activeProduct.discountRate,
          }),
        };
        this.initializeValueOfNumpadControl(this.dashboardNumpadProps.activeAction);
        this.activeProductPropChangeListen();
      }
    }
    this.dashboardNumpadProps.activeProduct = activeProduct;
  }

  listenActiveProductChange() {
    this.getActiveProduct()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((product: ICheckItem) => {
        this.focusFormOnActiveProduct(product);

        if (this.dashboardNumpadProps.activeAction === EPadAction.Quantity) {
          switch (product?.unitOfMeasurement) {
            case 1: {
              this.maxFractionDigits = 0;
              break;
            }
            case 2: {
              this.maxFractionDigits = 3;

              break;
            }
            default: {
              this.maxFractionDigits = 2;
            }
          }
        } else {
          this.maxFractionDigits = 2;
        }
        this._cd.markForCheck();
      });
  }

  activeProductPropChangeListen() {
    this._productGroup$ = this.dashboardNumpadProps.group.valueChanges.subscribe((productProps) => {
      this.productChange({
        activeProduct: this.activeProduct,
        padAction: this.dashboardNumpadProps.activeAction,
        productProps: {
          discountRate: productProps.discountRate,
          quantity: productProps.quantity,
          unitPrice: productProps.unitPrice,
        },
        controls: this.dashboardNumpadProps.group.controls,
      });
    });
  }

  activeActionChange(activeAction: EPadAction) {
    this.dashboardNumpadProps.activeAction = activeAction;
    if (this.dashboardNumpadProps.group) {
      this.initializeValueOfNumpadControl(this.dashboardNumpadProps.activeAction);
    }
  }

  initializeValueOfNumpadControl(activeAction: EPadAction, searchIsActive?: boolean) {
    if (searchIsActive) {
      this.dashboardNumpadProps.control = this.dashboardNumpadProps.group.controls
        .search as FormControl;
      return;
    }
    if (!this.dashboardNumpadProps.group) {
      this.dashboardNumpadProps.control = new FormControl();
      return;
    }
    switch (activeAction) {
      case EPadAction.Quantity: {
        this.dashboardNumpadProps.group.controls.quantity.setValue('', {
          emitEvent: false,
        });
        this.dashboardNumpadProps.control = this.dashboardNumpadProps.group.controls
          .quantity as FormControl;
        return;
      }
      case EPadAction.DiscountPercentage: {
        this.dashboardNumpadProps.group.controls.discountRate.setValue('', {
          emitEvent: false,
        });
        this.dashboardNumpadProps.control = this.dashboardNumpadProps.group.controls
          .discountRate as FormControl;
        return;
      }
      case EPadAction.UnitPrice: {
        this.dashboardNumpadProps.group.controls.unitPrice.setValue('', {
          emitEvent: false,
        });
        this.dashboardNumpadProps.control = this.dashboardNumpadProps.group.controls
          .unitPrice as FormControl;
        return;
      }
      // case EPadAction.Customer: {
      //   value.controls.customer.setValue('', { emitEvent: false });
      //   this.formControl = value.controls.customer as FormControl;
      //   return;
      // }
    }
  }

  onSearchFocused(formGroup: FormGroup): void {
    if (formGroup) {
      this.activateProduct(null);
    }
    this.dashboardNumpadProps = {
      ...this.dashboardNumpadProps,
      group: formGroup,
    };
    this.initializeValueOfNumpadControl(
      this.dashboardNumpadProps.activeAction,
      formGroup ? true : false
    );
  }

  private keyDownTextField(e: any): void {
    // this._mainProcessService.logger.info(
    //   'dev => dashboard => keyDownTextField, e.keyCode:',
    //   e.keyCode
    // );
    // this._mainProcessService.logger.info(
    //   'dev => dashboard => keyDownTextField, searchControl:',
    //   this.dashboardNumpadProps.group?.controls.search
    // );
    if (!this.shiftService.currentShift) {
      this.barCode = '';
      return;
    }

    if (e.keyCode === 13) {
      let stockitemWeight: number;
      let request: Observable<IResult<IStockItem[]>>;
      this._mainProcessService.logger.info(
        'keyDownTextField -> handle barcode:this.barCode:',
        this.barCode
      );
      if (this.barCode.indexOf('200') === 0) {
        request = this._mainProcessService.getProductByBarcode(this.barCode.slice(0, 7));
        stockitemWeight = Number(this.barCode.slice(7, 12)) / 1000;
        console.log(333333333333333333, this.barCode.slice(7, 12), this.barCode.slice(0, 7));
      } else {
        request = this._mainProcessService.getProductByBarcode(this.barCode);
        stockitemWeight = 1;
      }

      request
        .pipe(
          takeUntil(this.unsubscribe$),
          // tap((response) => console.log('dev => response for barcode search is:', response)),
          switchMap((response) => {
            // console.log('dev => response length is 0:', response?.data?.length === 0);
            return response?.data?.length === 0
              ? this._mainProcessService
                .getProductByBarcode(this.barCode)
                .pipe(tap((_) => (stockitemWeight = 1)))
              : of(response);
          })
          // tap((response) => console.log('dev => response for barcode search is:', response))
        )
        .subscribe(({ data }) => {
          console.log(
            '🚀 ~ file: dashboard.component.ts ~ line 290 ~ DashboardComponent ~ request.pipe ~ data',
            data
          );
          this._dialog.closeAll();
          this._mainProcessService.logger.info(
            'keyDownTextField -> request resonseData',
            data,
            'weight',
            stockitemWeight,
            'barcode',
            this.barCode
          );
          this.checkStockitemsLengthAndIMEIS(data, stockitemWeight, this.barCode);
          this.barCode = '';
        });
    } else {
      // Generating barcode.
      if (e.keyCode === 16) {
        return;
      }
      this.barCode += e.keyCode ? String.fromCharCode(e.keyCode) : '';
    }
  }

  private checkStockitemsLengthAndIMEIS(stockitems, stockitemWeight, barcode): void {
    if (!stockitems?.length) {
      this.openMessagePopup('პროდუქტი ვერ მოიძებნა');
      return;
    }

    if (stockitems.length === 1) {
      // this._mainProcessService.logger.info('checkStockitemsLengthAndIMEIS => handle one item');
      if (barcode === stockitems[0].imei) {
        stockitems[0].stockItemIMEI = stockitems[0].imei;
        this.checkAndAddProduct(stockitems[0], stockitemWeight);
        return;
      }

      // console.log('checkStockitemsLengthAndIMEIS => final branch');
      this.getIMEISByStockitem(stockitems, stockitemWeight);
    }

    if (stockitems.length > 1) {
      // this._mainProcessService.logger.info(
      //   'checkStockitemsLengthAndIMEIS => handle many items',
      //   stockitems.length
      // );
      this.openStockitemAssortimentsDialog(stockitems, [], stockitemWeight);
    }
  }

  private getIMEISByStockitem(stockitems, stockitemWeight): void {
    console.log('getIMEISByStockitem -> stockitems: ', stockitems);
    if (!stockitems[0].hasImei) {
      this._mainProcessService.logger.info(
        'getIMEISByStockitem -> no IMEI add product to check',
        stockitems[0]?.barcode
      );
      this.checkAndAddProduct(stockitems[0], stockitemWeight);
      return;
    }

    this._mainProcessService
      .getIMEISByStockItem(stockitems[0].id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((imeisList) => {
        if (imeisList.data.length <= 1) {
          this.checkAndAddProduct(stockitems[0], stockitemWeight);
          return;
        }
        this.openDialogForImeis(imeisList.data, stockitems, stockitemWeight);
      });
  }

  private openDialogForImeis(imeiResult, result, stockitemWeight) {
    this._dialog
      .open(AssortimentsDialogComponent, {
        width: '705px',
        panelClass: 'Assortiments-dialog-popup',
        data: {
          products: result,
          IMEICodes: imeiResult,
          listProducts: this.activeCheckProducts,
          isIMEI: true,
        },
        disableClose: true,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value) {
          if (value === true) {
            this.checkAndAddProduct(result, stockitemWeight);
          } else {
            this.checkAndAddProduct(value, stockitemWeight);
          }
        }
      });
  }

  private openProductExhaustionPopup(product, stockitemWeight): void {
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
          this.checkAndAddProduct(product, stockitemWeight);
          return;
        }
        // false mean sync
        if (result === false) {
          this._dialog.open(SyncLoadingPopupComponent, {
            width: '520px',
          });
        }
      });
  }

  private openStockitemAssortimentsDialog(result, resultImei, stockitemWeight) {
    this._dialog
      .open(AssortimentsDialogComponent, {
        width: '705px',
        panelClass: 'Assortiments-dialog-popup',
        data: {
          products: result,
          IMEICodes: resultImei,
          isIMEI: false,
        },
        disableClose: true,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value) {
          this.getIMEISByStockitem([value], stockitemWeight);
        }
      });
  }

  private checkAndAddProduct(product: any, stockitemWeight) {
    if (!product) {
      this.openMessagePopup('პროდუქტი ვერ მოიძებნა');
      return;
    }

    const mergedProduct: ICheckItem = {
      stockItemId: product.id,
      stockItemIMEI: product.imei,
      name: product.name,
      barcode: product.barcode,
      quantity: stockitemWeight || 1,
      quantityInStock: product.quantity,
      unitPrice: product.unitPrice,
      discountRate: Number(product.discountPercentage) || 0,
      initialUnitPrice: product.unitPrice,
      unitOfMeasurement: product.unitOfMeasurement,
      totalPrice: product.unitPrice,
      isReceipt: product?.isReceipt,
    };

    if (mergedProduct.stockItemIMEI) {
      for (let i = 0; i < this.activeCheckProducts.length; i++) {
        if (
          this.activeCheckProducts[i] &&
          this.activeCheckProducts[i].stockItemIMEI === mergedProduct.stockItemIMEI
        ) {
          this.openMessagePopup('პროდუქტი ვერ მოიძებნა');
          return;
        }
      }
    }
    this.addProductToCart(mergedProduct);
  }

  private addProductToCart(mergedProduct: ICheckItem) {
    this.addProduct(mergedProduct);
  }

  private openMessagePopup(message: string): void {
    this._dialog.closeAll();
    this._dialog.open(MessagePopupComponent, {
      width: '500px',
      data: {
        message,
        success: false,
      },
    });
    setTimeout(() => {
      this._dialog.closeAll();
    }, 2000);
  }

  onProductAdded(product: any): void {
    if (product.hasImei) {
      this._mainProcessService
        .getIMEISByStockItem(product.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((imeisList) => {
          console.log(
            '🚀 ~ file: dashboard.component.ts ~ line 491 ~ DashboardComponent ~ .subscribe ~ imeisList',
            imeisList
          );
          if (imeisList.data.length <= 1) {
            product.imei = imeisList.data[0].imei;
            console.log(44444444444, product);
            this.checkAndAddProduct(product, 1);
            return;
          }
          this.openDialogForImeis(imeisList.data, [product], 1);
        });
    } else {
      const mergedProduct: ICheckItem = {
        stockItemId: product.id,
        stockItemIMEI: product.imei,
        name: product.name,
        barcode: product.barcode,
        quantity: 1,
        quantityInStock: product.quantity,
        unitPrice: product.unitPrice,
        discountRate: Number(product.discountPercentage) || 0,
        initialUnitPrice: product.unitPrice,
        unitOfMeasurement: product.unitOfMeasurement,
        totalPrice: product.unitPrice,
        isReceipt: product?.isReceipt,
      };
      this.addProductToCart(mergedProduct);
    }
  }

  onSubmited(): void {
    if (!this.activeCheckProducts?.length || this.areChosenProductsTotalPriceMoreThanZero) {
      this.openInvalidProductsErrorPopup();
      return;
    }

    // todo
    if (this._storage.get('entitySwitcher') === 'ი/პ გაყიდვები') {
      this._router.navigate(['legal-entity']);
      return;
    }

    this._router.navigate(['/payment']);
  }

  private openInvalidProductsErrorPopup(): void {
    this._dialog.open(NotifierPopupComponent, {
      width: '500px',
      data: {
        message: 'გადახდის განსახორციელებლად საჭიროა პროდუქციის ფასი იყოს 0.00 ლარზე მეტი',
        success: false,
      },
    });
  }

  private get areChosenProductsTotalPriceMoreThanZero(): boolean {
    return this.activeCheckProducts.some((p) => !p.quantity || !p.unitPrice);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._productGroup$.unsubscribe();
  }
}
