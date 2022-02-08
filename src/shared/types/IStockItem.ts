import { ISupplier } from './ISupplier';
import { IStockItemCategory } from './IStockItemCategory';

export interface IStockItem {
  id: number;
  photoUrl: string;
  photoPath: string;
  barcode: string;
  name: string;
  quantity: number;
  unitPrice: number;
  soldQuantity?: number;
  category?: IStockItemCategory;
  suppliers?: ISupplier[];
  status: number;
  unitOfMeasurement?: number;
  unitPriceMin?: number;
  lowStockThreshold: number;
  hasIMEI?: boolean;
  imei?: string;
  isReceipt?: boolean;
  dashboardPriority?: number;
}
