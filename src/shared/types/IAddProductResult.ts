import { IResult } from './IResult';
import { ICheck } from './ICheck';
import { ICheckItem } from './ICheckItem';
export interface IAddProductResult {
  addProductResult: IResult<ICheck>;
  product: ICheckItem;
}
