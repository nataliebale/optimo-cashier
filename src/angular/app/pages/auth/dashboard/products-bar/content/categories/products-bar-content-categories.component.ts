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
import { IStockItemCategory } from '../../../../../../../../shared/types/IStockItemCategory';
import { ListFilterModel } from '../list/products-bar-content-list.component';

@Component({
  selector: 'app-products-bar-content-categories',
  templateUrl: './products-bar-content-categories.component.html',
  styleUrls: ['./products-bar-content-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsBarContentCategoriesComponent extends BaseContentListComponent<
  IStockItemCategory
> {
  private _filter: ListFilterModel;
  @Input()
  set filter(value: ListFilterModel) {
    console.log('CategoriesListComponent -> setfilter -> value', value);
    this._filter = value;
    this.reset();
  }

  get filter(): ListFilterModel {
    return this._filter;
  }

  get searchPopular(): boolean {
    return 'პოპულარული'.indexOf(this.filter.searchTerm) === 0;
  }

  @Output()
  selectCategory = new EventEmitter<IStockItemCategory>();

  @Output()
  selectPopular = new EventEmitter<void>();

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
      return this.odin.getCategories(this.pageIndex, 18, this.filter.searchTerm);
    });
  }
}
