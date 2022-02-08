import { SaleReturnReason } from '../enums/SaleReturnReason';

export interface IReturnedStockItem {
  stockItemId: number;
  stockItemIMEI?: string;
  quantity: number;
  reason?: SaleReturnReason;
  delist: boolean;
}
