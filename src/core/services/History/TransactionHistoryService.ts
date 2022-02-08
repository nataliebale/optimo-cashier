import { IOrderItem } from './../../../shared/types/IOrderItem';
import { inject, injectable } from 'inversify';
import { Any, Between, FindOperator, In, Not } from 'typeorm';
import { ApplicationDb } from '../../infrastructure/ApplicationDb';
import { TransactionDb } from '../../infrastructure/TransactionDb';
import * as log from 'electron-log';
import { ITransactionListItem } from '../../../shared/types/ITransactionList';
import { ITransactionHistoryFilterWithSearch } from '../../../shared/types/ITransactionHistoryFilter';
import { PaymentMethods } from '../../../shared/enums/PaymentMethods';
import { IOrderLine, ITransactionDetails } from '../../../shared/types/ITransactionDetails';
import { EntityPaymentMethods } from '../../../shared/enums/EntityPaymentMethods';
import { TransactionHistoryQueries } from '../../queries/TransactionHistoryQueries';
import { StockItem, Supplier } from '../../infrastructure/Entities';
import { ReturnTransactionStatus } from '../../infrastructure/Entities/Transaction/ReturnTransactionStatus';
import { addHours, addMinutes } from 'date-fns';
import { getLocaleDateTimeFormat } from '@angular/common';

@injectable()
export class TransactionHistoryService {
  constructor(
    @inject(ApplicationDb) private readonly _db: ApplicationDb,
    @inject(TransactionDb) private readonly _transactionDb: TransactionDb
  ) {}

  async getTransactionHistoryList(
    filter: ITransactionHistoryFilterWithSearch,
    entity: boolean
  ): Promise<ITransactionListItem[]> {
    // format dates
    const dateFrom = new Date(filter.from).toISOString().replace('T', ' ').replace('Z', '');
    const dateTo = new Date(filter.to).toISOString().replace('T', ' ').replace('Z', '');

    let paymentMethodFilter: FindOperator<any>;

    if (filter?.paymentMethod === PaymentMethods.Cash) {
      paymentMethodFilter = In([PaymentMethods.Cash, PaymentMethods.Manual]);
    } else if (filter?.paymentMethod === PaymentMethods.Card) {
      paymentMethodFilter = In([PaymentMethods.Card]);
    } else {
      paymentMethodFilter = In([PaymentMethods.Cash, PaymentMethods.Manual, PaymentMethods.Card]);
    }

    const transactions = entity
      ? await this._transactionDb.entityTransactionLogRepository.find({
          select: ['id', 'orderDate', 'tableId', 'orderTotalPrice'],
          where: {
            orderDate: Between(dateFrom, dateTo),
            paymentMethod:
              filter?.paymentMethod ||
              In([
                EntityPaymentMethods.Card,
                EntityPaymentMethods.Cash,
                EntityPaymentMethods.Consignation,
              ]),
          },
          order: {
            orderDate: 'DESC',
          },
        })
      : await new TransactionHistoryQueries(
          this._db,
          this._transactionDb
        ).findTransactionsWithReturnIds(
          dateFrom,
          dateTo,
          filter.searchStr,
          filter.paymentMethod
            ? [filter.paymentMethod]
            : [
                EntityPaymentMethods.Card,
                EntityPaymentMethods.Cash,
                EntityPaymentMethods.Consignation,
              ]
        );
    // ? await this._transactionDb.entityTransactionLogRepository.find({
    //     select: ['id', 'orderDate', 'tableId', 'orderTotalPrice'],
    //     where: {
    //       orderDate: Between(dateFrom, dateTo),
    //       paymentMethod:
    //         filter?.paymentMethod ||
    //         In([
    //           EntityPaymentMethods.Card,
    //           EntityPaymentMethods.Cash,
    //           EntityPaymentMethods.Consignation,
    //         ]),
    //     },
    //     order: {
    //       orderDate: 'DESC',
    //     },
    //   })
    // : await this._transactionDb.transactionLogRepository.find({
    //     select: ['id', 'orderDate', 'tableId', 'orderTotalPrice'],
    //     where: {
    //       orderDate: Between(dateFrom, dateTo),
    //       paymentMethod: paymentMethodFilter,
    //     },
    //     order: {
    //       orderDate: 'DESC',
    //     },
    //   });

    const tables = await this._db.tableRepository.find({
      select: ['id', 'name'],
      where: {
        status: Not('99'),
      },
    });

    const timezoneOffset = new Date().getTimezoneOffset();

    const result: ITransactionListItem[] = (transactions as any)?.map(
      (transaction): ITransactionListItem => {
        return {
          id: transaction.id,
          totalAmount: transaction.orderTotalPrice,
          tableName: tables.find((table) => table.id === transaction?.tableId)?.name,
          orderDate: addMinutes(new Date(transaction.orderDate), -timezoneOffset),
          isCancelled: transaction?.isCancelled,
          isCorrected: transaction?.isCorrected,
        };
      },
      timezoneOffset
    );

    return result;
  }

  async getTransactionDetails(
    transactionId: number,
    entity: boolean
  ): Promise<ITransactionDetails> {
    const transaction = entity
      ? await this._transactionDb.entityTransactionLogRepository.findOne(transactionId)
      : await this._transactionDb.transactionLogRepository.findOne({
          relations: ['orderLines'],
          where: { id: transactionId },
        });
    // console.log('dev => getTransactionDetails => transaction ', transaction);
    const table = await this._db.tableRepository.findOne({
      select: ['id', 'space', 'name'],
      relations: ['space'],
      where: {
        id: transaction?.tableId,
      },
    });
    // console.log('dev => getTransactionDetails => tableWithSpace ', table);

    const operator = await this._db.operatorRepository.findOne(transaction.operatorId);
    // console.log('dev => getTransactionDetails => operator ', operator);

    // find and set linked transaction id
    let linkedTransactionId = null;
    try {
      const returnTransaction = await this._transactionDb.returnTransactionLogRepository.findOne({
        where: {
          returnedTransactionId: transaction.transactionId,
          status: ReturnTransactionStatus.Finished,
        },
      });

      const newTransactionGuid = returnTransaction.newTransactionId;

      const newTransaction = await this._transactionDb.transactionLogRepository.findOne({
        where: { transactionId: newTransactionGuid },
      });

      linkedTransactionId = newTransaction.id;
    } catch (e) {
      // do nothing if not found will catch error
    }

    // find cancelledTransaction id
    let cancelledTransactionId = null;
    try {
      const returnTransaction = await this._transactionDb.returnTransactionLogRepository.findOne({
        where: {
          newTransactionId: transaction.transactionId,
          status: ReturnTransactionStatus.Finished,
        },
      });

      const cancelledTransactionGuid = returnTransaction.returnedTransactionId;

      const cancelledTransaction = await this._transactionDb.transactionLogRepository.findOne({
        where: { transactionId: cancelledTransactionGuid },
      });

      cancelledTransactionId = cancelledTransaction.id;
    } catch (e) {
      // do nothing if not found will catch error
    }

    // find is transaction is cancelled
    let transactionIsCancelled = false;
    try {
      const returnTransaction = await this._transactionDb.returnTransactionLogRepository.findOne({
        where: {
          returnedTransactionId: transaction.transactionId,
          status: ReturnTransactionStatus.Finished,
        },
      });
      transactionIsCancelled = returnTransaction ? true : false;
    } catch (e) {
      // do nothing if not found
    }

    const result: ITransactionDetails = {
      id: transaction.id,
      orderDate: transaction.orderDate,
      operatorId: transaction.operatorId,
      operatorName: operator.name,
      orderTotalPrice: transaction.orderTotalPrice,
      paymentMethod: transaction.paymentMethod,
      taxAmount: transaction.taxAmount,
      taxRate: transaction.taxRate,
      tableName: table?.name,
      spaceName: table?.space?.name,
      guestCount: transaction.guestCount,
      paymentType: transaction.paymentType,
      linkedTransactionId: linkedTransactionId,
      cancelledTransactionId: cancelledTransactionId,
      isCancelled: transactionIsCancelled,
      canBeReversed: (transaction as any)?.canBeReversed,
      orderLines: (
        await Promise.all(
          (transaction.orderLines as IOrderItem[]).map(
            async (val): Promise<IOrderLine> => {
              const stockItemData = await this.getStockItemById(val.stockItemId);
              const isReceipt = stockItemData?.suppliers?.find(
                (supplier: Supplier) => supplier.id === -1
              )
                ? true
                : false;
              return {
                stockItemId: val.stockItemId,
                name: val.name,
                quantity: val.quantity,
                totalPrice: val.totalPrice,
                unitPrice: val.unitPrice,
                unitOfMeasurement: val.unitOfMeasurement,
                IMEI: val.stockItemIMEI,
                photoUrl: stockItemData.photoUrl,
                stockItemBarcode: stockItemData.barcode,
                isReceipt: isReceipt,
              };
            }
          )
        )
      ).sort((orderLineA, orderLineB) => orderLineA.stockItemId - orderLineB.stockItemId),
    };

    return result;
  }

  async getStockItemById(id: number): Promise<StockItem> {
    const stockItem = await this._db.stockItemRepository.findOne(id, {
      relations: ['suppliers'],
    });
    return stockItem;
  }
}
