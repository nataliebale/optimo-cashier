import { ICheckItem } from './ICheckItem';
import { IEntityOrderDetails } from './IEntityOrderDetails';

export interface ICheck {
  id: number;
  operatorId: number;
  shiftId: number;
  tableId?: number;
  guestCount?: number;
  products: ICheckItem[];
  legalEntityData?: IEntityOrderDetails;
  basketTotalPrice: number;
  taxRate: number;
  taxAmount: number;
  totalPrice: number;
}


