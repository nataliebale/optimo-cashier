import { IResult } from './IResult';
import { ICheck } from './ICheck';
import { ICheckItem } from './ICheckItem';

export interface ICheckAndProductResult {
  addNewCheckResult: IResult<ICheck>;
  product: ICheckItem;
}
