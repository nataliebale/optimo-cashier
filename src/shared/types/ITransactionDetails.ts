import { EntityPaymentMethods } from '../enums/EntityPaymentMethods';
import { PaymentMethods } from '../enums/PaymentMethods';
import { EntityPaymentType } from './IEntityOrder';
import { PaymentType } from './IOrder';

export interface ITransactionDetails {
  id: number;
  orderDate: Date;
  operatorId: number;
  operatorName: string;
  paymentMethod: PaymentMethods | EntityPaymentMethods;
  paymentType: PaymentType | EntityPaymentType;
  orderTotalPrice: number;
  taxAmount: number;
  taxRate: number;
  orderLines: IOrderLine[];
  tableName: string;
  spaceName: string;
  guestCount: number;
  linkedTransactionId: number;
  cancelledTransactionId: number;
  isCancelled: boolean;
  canBeReversed: boolean;
}

export interface IOrderLine {
  stockItemId: number;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  unitOfMeasurement: number;
  photoUrl: string;
  stockItemBarcode: string;
  IMEI?: string;
  isReceipt: boolean;
}

// { mock
//   id: 1,
//   orderDate: 2020-12-14T12:36:54.132Z,
//   operatorId: 1,
//   paymentMethod: 1,
//   transactionId: 'b424807b-c0b3-4573-970a-d44747ba0e00',
//   taxAmount: 0,
//   taxRate: 0,
//   transactionDescription: null,
//   orderLines: [
//     {
//       stockItemId: 62,
//       stockItemIMEI: null,
//       name: 'ვაშლის წვენი',
//       barcode: '600100',
//       quantity: 1,
//       quantityInStock: -104,
//       unitPrice: 3,
//       discountRate: 0,
//       initialUnitPrice: 3,
//       unitOfMeasurement: 1,
//       totalPrice: 3
//     }
//   ],
//   shiftId: 1,
//   orderTotalPrice: 8,
//   guestCount: 1,
//   tableId: 161
// }
