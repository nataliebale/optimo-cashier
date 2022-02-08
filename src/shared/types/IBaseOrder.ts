import { IOrderItem } from './IOrderItem';

export interface IBaseOrder {
  orderId: string;
  orderItems: IOrderItem[];
  taxAmount: number;
  taxRate: number;
  isDetailed: boolean;
  operatorId?: number;
  basketTotalPrice: number;
  totalPrice: number;
  receiptNumber: number;
  operatorName: string;
  checkDate?: Date;
  orderDate?: Date;
  tableName?: string;
  spaceName?: string;
  guestCount?: number;
  tableId?: number;
}
