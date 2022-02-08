import { TransportationType } from '../../../../shared/types/ETransportationType';
import { IBaseOrder } from '../../../../shared/types/IBaseOrder';
import { EntityPaymentType, IEntityOrder } from '../../../../shared/types/IEntityOrder';
import { IOrderItem } from '../../../../shared/types/IOrderItem';

export class EntityOrder implements IEntityOrder, IBaseOrder {
  entityIdentifier: string;
  entityName: string;
  entityType: string;
  hasTransportation: boolean;
  startAddress: string;
  endAddress: string;
  driverPIN: string;
  driverName: string;
  driverCarNumber: string;
  driverIsForeignСitizen: boolean;
  transportName?: string;
  transportationType?: TransportationType;
  comment: string;
  orderId: string;
  orderItems: IOrderItem[];
  taxAmount: number;
  taxRate: number;
  basketTotalPrice: number;
  totalPrice: number;
  paymentType: EntityPaymentType;
  isDetailed: boolean;
  operatorId?: number;
  receiptNumber: number;
  operatorName: string;
  checkDate?: Date;
  orderDate?: Date;
  entityClientId?: number;
  tableId?: number;
  tableName?: string;
  spaceName?: string;
  guestCount?: number;
}
