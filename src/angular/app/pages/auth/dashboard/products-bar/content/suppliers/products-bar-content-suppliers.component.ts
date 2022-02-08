import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs';
import { MainProcessService } from '../../../../../../core/services/main-process/main-process.service';
import { EventBusService } from '../../../../../../core/services/event-bus.service';
import { DOCUMENT } from '@angular/common';
import { BaseContentListComponent } from '../base-content-list.component';
import { ISupplier } from '../../../../../../../../shared/types/ISupplier';
import { ListFilterModel } from '../list/products-bar-content-list.component';

@Component({
  selector: 'app-products-bar-content-suppliers',
  templateUrl: './products-bar-content-suppliers.component.html',
  styleUrls: ['./products-bar-content-suppliers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsBarContentSuppliersComponent extends BaseContentListComponent<ISupplier> {
  private _filter: ListFilterModel;
  @Input()
  set filter(value: ListFilterModel) {
    console.log('SuppliersListComponent -> setfilter -> value', value);
    this._filter = value;
    this.reset();
  }

  get filter(): ListFilterModel {
    return this._filter;
  }
  @Output()
  selectSupplier = new EventEmitter<ISupplier>();

  constructor(
    private odin: MainProcessService,
    cdr: ChangeDetectorRef,
    eventBus: EventBusService,
    @Inject(DOCUMENT) document: Document
  ) {
    super(cdr, eventBus, document);
  }

  protected get toHttpGetItems(): OperatorFunction<void, any> {
    return switchMap(() => {
      return this.odin.getSuppliers(this.pageIndex, 18, this.filter.searchTerm);
    });
  }
}
