import { ICheckItem } from './ICheckItem';
import { ICreateCheckRequest } from './ICreateCheckRequest';
export interface ICheckAndProductRequest {
  checkRequest: ICreateCheckRequest;
  product: ICheckItem;
}
