import { EntityPaymentMethods } from '../../shared/enums/EntityPaymentMethods';
import { PaymentMethods } from '../../shared/enums/PaymentMethods';
import { ApplicationDb } from '../infrastructure/ApplicationDb';
import { TransactionDb } from '../infrastructure/TransactionDb';

export class TransactionHistoryQueries {
  constructor(private readonly _db: ApplicationDb, private readonly _tdb: TransactionDb) {}

  async findTransactionsWithReturnIds(
    dateFrom: string,
    dateTo: string,
    transactionIdOrBarcode: string | null,
    paymentMethods: (PaymentMethods | EntityPaymentMethods)[]
  ) {
    const paymentMethodsStr = paymentMethods.join(', ');
    const query = `
      SELECT 
        tl.'id' AS id,
        tl.'orderDate' AS orderDate,
        tl.'tableId' AS tableId,
        tl.'orderTotalPrice' AS orderTotalPrice,
        rtl.'returnedTransactionId' AS returnedTransactionId,
        rtl.'newTransactionId' AS newTransactionId,
        CASE WHEN rtl.'returnedTransactionId' IS NULL THEN false ELSE true END as isCancelled,
        CASE WHEN rtl2.newTransactionId IS NULL THEN false ELSE TRUE END as isCorrected
      FROM transaction_log tl
      LEFT JOIN return_transaction_log rtl
        ON rtl.returnedTransactionId = tl.transactionId
          AND
          rtl.status = 5
      LEFT JOIN return_transaction_log rtl2
        ON rtl2.newTransactionId = tl.transactionId
          AND
          rtl2.status = 5
      WHERE
        tl.paymentMethod IN(${paymentMethodsStr})
        AND
        tl.'orderDate' BETWEEN '${dateFrom}' AND '${dateTo}'
        AND
        (
          tl.transactionId like('%${transactionIdOrBarcode || ''}%')
          OR
          EXISTS (
            SELECT * FROM transaction_log_order_line tlol
            WHERE 
              tlol.transactionId = tl.id
              AND
              (
                tlol.barcode like('%${transactionIdOrBarcode || ''}%')
                OR
                tlol.stockItemIMEI like('%${transactionIdOrBarcode || ''}%')
              )
          )
        )
      ORDER BY tl.'orderDate' DESC
      `;
    // console.log('dev => query is', query);
    return await this._tdb.query(query);
  }
}
