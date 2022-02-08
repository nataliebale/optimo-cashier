import { TransportationType } from './ETransportationType';
import { IOrderItem } from './IOrderItem';

export interface IEntityOrder {
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
  taxAmount: number;
  taxRate: number;
  orderId: string;
  orderItems: IOrderItem[];
  paymentType: EntityPaymentType;
  isDetailed: boolean;
  entityClientId?: number;
}

export enum EntityPaymentType {
  Cash = 0,
  BOG = 1,
  BOGExternal = 2,
  TBCExternal = 3,
  LibertyExternal = 4,
  ProcreditExternal = 5,
  Consignation = 98,
  Other = 99,
}
