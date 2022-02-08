export interface ITransactionListItem {
  id: number;
  totalAmount: number;
  tableName: string;
  orderDate: Date;
  isCancelled?: boolean;
  isCorrected?: boolean;
}

// { mock
//     id: 1,
//     totalAmount: 8,
//     tableName: '1',
//     orderDate: '2020-12-14T12:36:54.132Z'
//   },
