import { IStockItem } from './IStockItem';

export interface IStockItemCategory {
  id?: number;
  name: string;
  description?: string;
  status?: number;
  photoUrl?: string;
  photoPath?: string;
  childCategories?: IStockItemCategory[];
  parentCategory?: IStockItemCategory;
  stockItems?: IStockItem[];
}
