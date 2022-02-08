import { PaymentMethod } from '../../../../shared/enums/PaymentMethod';
import { PurchaseOrderStatus } from '../../../../shared/enums/PurchaseOrderStatus';

export interface PurchaseOrderDTO {
  id: number;
  locationId: number;
  supplierId: number;
  paymentMethod: PaymentMethod;
  name: string;
  orderDate: Date;
  expectedReceiveDate: Date;
  receiveDate?: Date;
  status: PurchaseOrderStatus;
  expectedTotalCost: number;
  receivedTotalCost: number;
  comment: string;
  orderLines: PurchaseOrderLineDTO[];
}

export interface PurchaseOrderLineDTO {
  id: number;
  stockItemId: number;
  orderedQuantity: number;
  expectedUnitCost: number;
  expectedTotalCost: number;
  receivedQuantity: number;
  receivedUnitCost: number;
  receivedTotalCost: number;
}
