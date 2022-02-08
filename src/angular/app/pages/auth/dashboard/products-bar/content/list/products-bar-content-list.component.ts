import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
  Inject,
} from '@angular/core';
import { takeUntil, switchMap } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs';
import { MainProcessService } from '../../../../../../core/services/main-process/main-process.service';
import {
  DialogPopupComponent,
  DialogPopupData,
} from '../../../../../../shared-components/popups/dialog-popup/dialog-popup.component';
import { SyncLoadingPopupComponent } from '../../../../../../shared-components/popups/sync-loading-popup/sync-loading-popup.component';
import { IStockItem } from '../../../../../../../../shared/types/IStockItem';
import { EventBusService, Event } from '../../../../../../core/services/event-bus.service';
import { DOCUMENT } from '@angular/common';
import { BaseContentListComponent } from '../base-content-list.component';

export interface ListFilterModel {
  searchTerm: string;
  categoryId: number;
  supplierId: number;
  topSold: boolean;
}

@Component({
  selector: 'app-products-bar-content-list',
  templateUrl: './products-bar-content-list.component.html',
  styleUrls: ['./products-bar-content-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsBarContentListComponent extends BaseContentListComponent<IStockItem> {
  @ViewChild('exhaustionTitle', { static: true })
  exhaustionTitleRef: TemplateRef<any>;

  @ViewChild('exhaustionMessage', { static: true })
  exhaustionMessageRef: TemplateRef<any>;

  private _filter: ListFilterModel;
  @Input() isHorecaMode: boolean;
  @Input()
  set filter(value: ListFilterModel) {
    console.log('ProductsBarContentListComponent -> setfilter -> value', value);
    this._filter = value;
    this.reset();
  }

  get filter(): ListFilterModel {
    return this._filter;
  }

  @Output()
  productChosen = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private odin: MainProcessService,
    cdr: ChangeDetectorRef,
    eventBus: EventBusService,
    @Inject(DOCUMENT) document: Document
  ) {
    super(cdr, eventBus, document);
  }

  protected get toHttpGetItems(): OperatorFunction<void, any> {
    return switchMap(() => {
      return this.odin.getProducts(
        this.filter.searchTerm,
        this.pageIndex,
        18,
        this.filter.categoryId,
        this.filter.topSold,
        this.filter.supplierId,
        !this.filter.categoryId && !this.filter.supplierId && !this.filter.topSold
      );
    });
  }

  onProductClick(product: IStockItem): void {
    // if (product.quantity <= 0) {
    //   this.openExhaustionPopup(product);
    // } else {
    this.productChosen.emit(product);
    // }
  }

  // private openExhaustionPopup(product: IStockItem): void {
  //   this.dialog
  //     .open(DialogPopupComponent, {
  //       width: '496px',
  //       data: {
  //         title: this.exhaustionTitleRef,
  //         message: this.exhaustionMessageRef,
  //         approveLabel: 'გაგრძელება',
  //         declineLabel: 'განახლება',
  //         hideClose: true,
  //       } as DialogPopupData,
  //     })
  //     .afterClosed()
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe((result) => {
  //       if (result) {
  //         this.productChosen.emit(product);
  //         return;
  //       }
  //       // false mean sync
  //       if (result === false) {
  //         this.openSyncPopup();
  //       }
  //     });
  // }

  // private openSyncPopup(): void {
  //   this.dialog.open(SyncLoadingPopupComponent, {
  //     width: '500px',
  //   });
  // }
}
