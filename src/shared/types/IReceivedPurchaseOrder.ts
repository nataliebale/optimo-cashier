export interface IReceivedPurchaseOrder {
  id?: number;
  receiveDate: Date;
  orderLines: IReceivedPurchaseOrderLine[];
}

export interface IReceivedPurchaseOrderLine {
  id: number;
  receivedQuantity: number;
  receivedUnitCost: number;
}
