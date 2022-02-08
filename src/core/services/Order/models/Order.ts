import { IBaseOrder } from '../../../../shared/types/IBaseOrder';
import { IOrder, PaymentType } from '../../../../shared/types/IOrder';
import { IOrderItem } from '../../../../shared/types/IOrderItem';

export class Order implements IOrder, IBaseOrder {
  orderId: string;
  orderItems: IOrderItem[];
  taxAmount: number;
  taxRate: number;
  basketTotalPrice: number;
  totalPrice: number;
  paymentType: PaymentType;
  isDetailed: boolean;
  operatorId?: number;
  receiptNumber: number;
  operatorName: string;
  checkDate?: Date;
  orderDate?: Date;
  tableName?: string;
  spaceName?: string;
  guestCount?: number;
  tableId?: number;
}
