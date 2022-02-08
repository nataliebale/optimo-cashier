import { IOrderItem } from './IOrderItem';

export interface IOrder {
  orderId: string;
  orderItems: IOrderItem[];
  taxAmount: number;
  taxRate: number;
  paymentType: PaymentType;
  isDetailed: boolean;
}

export enum PaymentType {
  Cash = 0,
  BOG = 1,
  BOGExternal = 2,
  TBCExternal = 3,
  LibertyExternal = 4,
  ProcreditExternal = 5,
  Manual = 98,
  Other = 99,
}
