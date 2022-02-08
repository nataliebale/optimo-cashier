import { IStockItem } from './IStockItem';
import { IPurchaseOrder } from './IPurchaseOrder';

export interface IPurchaseOrderLine {
  id: number;
  orderedQuantity: number;
  expectedUnitCost: number;
  expectedTotalCost: number;
  receivedQuantity: number;
  receivedUnitCost: number;
  receivedTotalCost: number;
  stockItem: IStockItem;
  purchaseOrder?: IPurchaseOrder;
}
