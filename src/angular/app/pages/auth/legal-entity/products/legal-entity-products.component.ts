import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonFunctions } from '../../../../../../shared/CommonFunctions';
import { OptimoProductType } from '../../../../../../shared/enums/OptimoProductType';
import { ICheckItem } from '../../../../../../shared/types/ICheckItem';
import { IStockItem } from '../../../../../../shared/types/IStockItem';
import { MainProcessService } from '../../../../core/services/main-process/main-process.service';

@Component({
  selector: 'app-legal-entity-products',
  templateUrl: './legal-entity-products.component.html',
  styleUrls: ['./legal-entity-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalEntityProductsComponent implements OnInit {
  @Input() products: ICheckItem[];
  @Input() totalPrice: number;
  @Input() taxAmount: number;
  @Input() checkTaxRateIsOff: boolean;
  @Input() totalCost: number;
  public get isHorecaMode(): boolean {
    return this._mainProcessService?.settings?.productType === OptimoProductType.HORECA;
  }
  constructor(private _mainProcessService: MainProcessService) {}

  ngOnInit(): void {}

  getUnitOfMeasurement(product: IStockItem): string {
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

  countProductPrice(quantity, price) {
    return CommonFunctions.countProductPrice(quantity, price);
  }
}
