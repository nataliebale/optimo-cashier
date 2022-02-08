export interface IEntityOrderDetails {
  id?: number;
  entityIdentifier: string;
  entityName: string;
  entityType?: string;
  startAddress: string;
  endAddress: string;
  hasTransportation: boolean;
  driverPIN: string;
  driverName: string;
  driverCarNumber: string;
  driverIsForeignСitizen: boolean;
  comment: string;
  paymentType: string;
  name: string;
  code: string;
  entityClientId?: number;
  transportName?: string;
  transportationType?: number;
}
