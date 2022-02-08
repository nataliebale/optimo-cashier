import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MainProcessService } from '../../../../../core/services/main-process/main-process.service';
import { IStockItem } from '../../../../../../../shared/types/IStockItem';
import { ProductsBarTab } from '../tabs/products-bar-tabs.component';
import { ListFilterModel } from './list/products-bar-content-list.component';
import { map } from 'rxjs/operators';
import { ISupplier } from '../../../../../../../shared/types/ISupplier';
import { IStockItemCategory } from '../../../../../../../shared/types/IStockItemCategory';

@Component({
  selector: 'app-products-bar-content',
  templateUrl: './products-bar-content.component.html',
  styleUrls: ['./products-bar-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsBarContentComponent implements OnDestroy {
  @Input()
  isHorecaMode: boolean;
  private _tab: ProductsBarTab;
  @Input()
  set tab(value: ProductsBarTab) {
    this._tab = value;
    this.onReset();
  }

  get tab(): ProductsBarTab {
    return this._tab;
  }

  @Input()
  set searchTerm(value: string) {
    this.filterValue = {
      ...this.filterValue,
      searchTerm: value || '',
    };
  }

  @Output()
  productChosen = new EventEmitter<IStockItem>();

  @Output()
  resetSearchValue = new EventEmitter<any>();

  @Output()
  hasSubtitle = new EventEmitter<boolean>();

  ProductsBarTab = ProductsBarTab;
  filterValue: ListFilterModel = {
    searchTerm: '',
    categoryId: null,
    supplierId: null,
    topSold: false,
  };

  private unsubscribe$ = new Subject<void>();

  subTitle: string;

  constructor(private odin: MainProcessService, private cdr: ChangeDetectorRef) {}

  onSelectSupplier(supplier: ISupplier): void {
    this.subTitle = supplier.name;
    this.hasSubtitle.emit(true);
    this.filterValue = {
      ...this.filterValue,
      supplierId: supplier.id,
      categoryId: null,
      topSold: false,
    };
    this.resetSearchValue.emit();
  }

  onSelectCategory(category: IStockItemCategory): void {
    this.subTitle = category.name;
    this.hasSubtitle.emit(true);
    this.filterValue = {
      ...this.filterValue,
      supplierId: null,
      categoryId: category.id,
      topSold: false,
    };
    this.resetSearchValue.emit();
  }

  onSelectPopular(): void {
    this.subTitle = 'პოპულარულები';
    this.hasSubtitle.emit(true);
    this.filterValue = {
      ...this.filterValue,
      supplierId: null,
      categoryId: null,
      topSold: true,
    };
  }

  onReset(): void {
    this.subTitle = null;
    this.hasSubtitle.emit(false);
    this.filterValue = {
      ...this.filterValue,
      supplierId: null,
      categoryId: null,
      topSold: false,
    };
  }

  // onCheckPhotoPath(photoUrl: string): Object {
  //   return photoUrl
  //     ? { 'backgrount-size': 'cover', 'background-image': `url(${photoUrl})` }
  //     : {
  //         'backgrount-size': '35%',
  //         'background-image':
  //           'url(../../../../../../../assets/images/icons/image.svg',
  //       };
  // }

  // {
  //   'background-image':
  //     'url(' +
  //     (category.photoUrl ||
  //       '../../../../../../../assets/images/icons/image.svg') +
  //     ')'
  // }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
