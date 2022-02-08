import { IReceivedPurchaseOrder, IReceivedPurchaseOrderLine } from '../../../../shared/types/IReceivedPurchaseOrder';

export class ReceivedOrder implements IReceivedPurchaseOrder {
  id?: number;
  receiveDate: Date;
  orderLines: IReceivedPurchaseOrderLine[];
  operatorId?: number;
}
