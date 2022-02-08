export interface IOrderItem {
  barcode: string,
  totalPrice?: number;
  stockItemId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  discountRate?: number;
  stockItemIMEI?: string;
  unitOfMeasurement: number;
}
