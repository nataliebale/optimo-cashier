import { PaymentType } from './IOrder';

export interface ICheckOrder {
  checkId: number;
  paymentType: PaymentType;
}
