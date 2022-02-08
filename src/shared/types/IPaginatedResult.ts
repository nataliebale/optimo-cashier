import { IResult } from './IResult';

export interface IPaginatedResult<T> extends IResult<T> {
  count: number;
}
