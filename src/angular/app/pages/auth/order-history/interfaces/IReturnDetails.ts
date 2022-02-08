import { SaleReturnReason } from '../../../../../../shared/enums/SaleReturnReason';
import { EntityPaymentType } from '../../../../../../shared/types/IEntityOrder';
import { PaymentType } from '../../../../../../shared/types/IOrder';

export interface IReturDetails {
  returnItems: IReturnOrderLine[];
  returnReason: SaleReturnReason;
  transactionId: number;
  paymentType: PaymentType | EntityPaymentType;
}

export interface IReturnOrderLine {
  stockItemId: number;
  returnQuantity: number;
  delitsAfterReturn: boolean;
  stockItemIMEI: string;
}
