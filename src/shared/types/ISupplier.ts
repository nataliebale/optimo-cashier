import { IStockItem } from './IStockItem';

export interface ISupplier {
  id: number;
  name: string;
  status: number;
  stockItems?: IStockItem[];
}
