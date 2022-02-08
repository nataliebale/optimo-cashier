export interface ITransactionDetailAction {
  transactionId: number;
  action: TransactionActionType;
}

export enum TransactionActionType {
  Return,
  Print,
  OpenLinked,
}
