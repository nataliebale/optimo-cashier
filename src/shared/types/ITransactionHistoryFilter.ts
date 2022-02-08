import { EntityPaymentMethods } from '../enums/EntityPaymentMethods';
import { PaymentMethods } from '../enums/PaymentMethods';

export interface ITransactionHistoryFilter {
  from: string;
  to: string;
  paymentMethod?: PaymentMethods | EntityPaymentMethods;
}

export interface ITransactionHistoryFilterWithSearch extends ITransactionHistoryFilter {
  searchStr: string;
}
