import { ITable } from './ITable';

export interface ISpace {
  id: number;
  name: string;
  status: number;
  tables: ITable[];
}
