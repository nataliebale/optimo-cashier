import { ISpace } from './ISpace';

export interface ITable {
  id: number;
  name: string;
  space: ISpace;
  arrangement: ITableArrangement;
}

export interface ITableArrangement {
  left: number;
  top: number;
  width: number;
  height: number;
  boxType: EBoxType;
}

export enum EBoxType {
  Circle = 0,
  Rectangle = 1,
}
