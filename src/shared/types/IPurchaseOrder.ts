import { IPurchaseOrderLine } from './IPurchaseOrderLine';
import { PaymentMethod } from '../enums/PaymentMethod';
import { PurchaseOrderStatus } from '../enums/PurchaseOrderStatus';
import { ISupplier } from './ISupplier';

export interface IPurchaseOrder {
  id: number;
  locationId: number;
  paymentMethod: PaymentMethod;
  name: string;
  orderDate: Date;
  expectedReceiveDate: Date;
  receiveDate?: Date;
  status: PurchaseOrderStatus;
  expectedTotalCost: number;
  receivedTotalCost: number;
  comment?: string;
  supplier: ISupplier;
  purchaseOrderLines?: IPurchaseOrderLine[];
}
