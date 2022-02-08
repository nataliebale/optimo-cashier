import { IOperator } from './IOperator';

export interface IShift {
  id?: number;
  startOperatorId: number;
  cashBegin: number;
  endOperatorId?: number;
  cashEnd?: number;
  dateBegin: Date;
  dateEnd?: Date;
  finished: boolean;
}
