import { ITable } from './ITable';
import { ETableStatus } from './ETableStatus';

export interface ITableWithStatus extends ITable {
  numberOfGuests: number;
  tableStatus: ETableStatus;
  operatorId: number;
  operatorName: string;
}
