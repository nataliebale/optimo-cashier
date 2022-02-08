export interface ICheckItem {
  stockItemId: number;
  stockItemIMEI?: string;
  name: string;
  barcode: string;
  quantity: number;
  quantityInStock?: number;
  unitPrice: number;
  discountRate?: number;
  initialUnitPrice: number;
  totalPrice: number;
  unitOfMeasurement: number;
  isReceipt: boolean;
}
