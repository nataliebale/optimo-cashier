import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonFunctions } from '../../../../../../shared/CommonFunctions';
import { ICheckItem } from '../../../../../../shared/types/ICheckItem';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketComponent implements OnInit {
  @Input() products: ICheckItem[];
  @Input() activeProduct: any;
  @Output() productDeleteHandler = new EventEmitter<ICheckItem>();
  @Output() activeProductChange = new EventEmitter<ICheckItem>();

  constructor() {}

  ngOnInit(): void {}

  getUnitOfMeasurement(product: ICheckItem): string {
    switch (product.unitOfMeasurement) {
      case 1:
        return 'ც';
      case 2:
        return 'კგ';
      case 3:
        return 'ლ';
      case 4:
        return 'მ';
      case 5:
        return 'მ²';
    }
  }

  // todo
  countProductPrice(product: ICheckItem) {
    if (!product.quantity || !product.unitPrice) {
      return 0;
    }
    return CommonFunctions.countProductPrice(product.quantity, product.unitPrice);
  }

  trackBy(_: any, product: ICheckItem): number {
    return product.stockItemId;
  }
}
