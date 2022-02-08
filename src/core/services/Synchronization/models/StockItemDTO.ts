export interface StockItemDTO {
  id: number;
  photoUrl: string;
  barcode: string;
  name: string;
  quantity: number;
  unitPrice: number;
  categoryId: number;
  status: number;
  unitOfMeasurement: number;
  unitPriceMin: number;
  lowStockThreshold: number;
  dashboardPriority?: number;
}
