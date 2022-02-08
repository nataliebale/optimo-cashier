import { SaleReturnReason } from '../enums/SaleReturnReason';
import { IReturnedStockItem } from './IReturnedStockItem';

export interface ICreateReturnOrderRequest {
  transactionLogId: number;
  returnedStockItems: IReturnedStockItem[];
  reason: SaleReturnReason;
}
