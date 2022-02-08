import { ICheckItem } from './ICheckItem';
import { EPadAction } from './EPadAction';
import { AbstractControl } from '@angular/forms';

export interface IProductPropChange {
  activeProduct: ICheckItem;
  productProps: {
    quantity: string;
    unitPrice: string;
    discountRate: string;
  };
  padAction: EPadAction;
  controls: {
    [key: string]: AbstractControl;
  };
}
