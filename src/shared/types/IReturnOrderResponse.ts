import { IOrderResponse } from './IOrderResponse';

export interface IReturnOrderResponse {
  reversal?: IOrderResponse;
  success: boolean;
}
