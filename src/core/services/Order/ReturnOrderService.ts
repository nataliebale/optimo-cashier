import { ShiftService } from './../Shift/ShiftService';
import { IFinishReturnOrderRequest } from './../../../shared/types/IFinishReturnOrderRequest';
import { ReturnTransaction } from './../../infrastructure/Entities/Transaction/ReturnTransaction';
import { ICreateReturnOrderResult } from '../../../shared/types/ICreateReturnOrderResult';
import { IReturnOrderResponse } from './../../../shared/types/IReturnOrderResponse';
import { IReturnedStockItem } from './../../../shared/types/IReturnedStockItem';
import { CommonFunctions } from './../../../shared/CommonFunctions';
import { OperatorService } from './../Operator/OperatorService';
import { ApplicationDb } from './../../infrastructure/ApplicationDb';
import { DeviceService } from './../Device/DeviceService';
import { TransactionDb } from './../../infrastructure/TransactionDb';
import { ICreateReturnOrderRequest } from '../../../shared/types/ICreateReturnOrderRequest';
import { CheckService } from './../Check/CheckService';
import { injectable, inject } from 'inversify';
import { PaymentType } from '../../../shared/types/IOrder';
import { OperatorPermissions } from '../../../shared/enums/OperatorPermissions';
import { IReturnOrderRequest } from '../../../shared/types/IReturnOrderRequest';
import { SettingsService } from '../Settings/SettingService';
import { OdinCardProvider } from '../../../shared/enums/OdinCardProvider';
import { ReturnTransactionStatus } from '../../infrastructure/Entities/Transaction/ReturnTransactionStatus';
import { TransactionStatus } from '../../infrastructure/Entities/Transaction/TransactionStatus';

@injectable()
export class ReturnOrderService {
  constructor(
    @inject(ApplicationDb) private _db: ApplicationDb,
    @inject(TransactionDb) private _transactionDb: TransactionDb,
    @inject(CheckService) private _checkService: CheckService,
    @inject(DeviceService) private _deviceService: DeviceService,
    @inject(OperatorService) private _operatorService: OperatorService,
    @inject(ShiftService) private _shiftService: ShiftService,
    @inject(SettingsService) private _settings: SettingsService
  ) {}

  public async createReturnOrder(
    data: ICreateReturnOrderRequest
  ): Promise<ICreateReturnOrderResult> {
    await this._operatorService.requirePermission(OperatorPermissions.canReturnOrder);

    var transaction = await await this._transactionDb.transactionLogRepository.findOne({
      relations: ['orderLines'],
      where: { id: data.transactionLogId },
    });

    if (!transaction) {
      throw new Error('transaction not found');
    }

    if (!transaction.canBeReversed) {
      throw new Error('Old transactions cannot be reversed');
    }

    if (transaction.status == TransactionStatus.Reversed) {
      throw new Error('Cannot reverse reversed transaction');
    }

    if (!data.returnedStockItems || data.returnedStockItems.length == 0) {
      throw new Error('empty returnedStockItems');
    }

    // prepare new check
    this._checkService.unsetActive();
    await this._checkService.createCheck(transaction.tableId, transaction.guestCount);
    const delistedStockItems: IReturnedStockItem[] = [];

    for (let orderLine of transaction.orderLines) {
      let itemToReturn = data.returnedStockItems?.find(
        (x) =>
          x?.stockItemId == orderLine.stockItemId &&
          (orderLine.stockItemIMEI ? x?.stockItemIMEI == orderLine.stockItemIMEI : true)
      );

      if (itemToReturn?.quantity > orderLine.quantity) {
        throw new Error('Returned quantity exceeds previos order quantity');
      }

      if (!itemToReturn || itemToReturn.quantity < orderLine.quantity) {
        const product = await this._db.stockItemRepository.findOne({ id: orderLine.stockItemId });

        await this._checkService.addItem({
          stockItemId: orderLine.stockItemId,
          stockItemIMEI: orderLine.stockItemIMEI,
          name: orderLine.name,
          barcode: product.barcode,
          quantity: CommonFunctions.subtraction(orderLine.quantity, itemToReturn?.quantity ?? 0, 4),
          quantityInStock: product.quantity,
          unitPrice: orderLine.unitPrice,
          discountRate: orderLine.discountRate,
          initialUnitPrice: product.unitPrice,
          totalPrice: orderLine.totalPrice,
          unitOfMeasurement: orderLine.unitOfMeasurement,
          isReceipt: product.isReceipt,
        });
      }

      if (itemToReturn?.delist) {
        itemToReturn.reason = data.reason;
        delistedStockItems.push(itemToReturn);
      }
    }

    let newCheck = this._checkService.getActive();

    if (!newCheck.products?.length) {
      await this._checkService.deleteCheck(newCheck.id, true);
      newCheck = null;
    }

    var returnTransaction = ReturnTransaction.CreateNew(
      data.reason,
      transaction.transactionId,
      this._operatorService.currentOperatorId,
      this._shiftService.currentShiftId,
      newCheck?.orderId,
      delistedStockItems
    );

    await this._transactionDb.returnTransactionRepository.save(returnTransaction);
    await this._transactionDb.returnTransactionLogRepository.save(returnTransaction);

    return {
      success: true,
      returnOrderId: returnTransaction.id,
      checkId: newCheck?.id,
      previousAmount: transaction.orderTotalPrice,
      newAmount: newCheck?.totalPrice ?? 0,
      returnAmount: CommonFunctions.subtraction(
        transaction.orderTotalPrice,
        newCheck?.totalPrice ?? 0,
        2
      ),
    };
  }

  public async returnOrder(data: IReturnOrderRequest): Promise<IReturnOrderResponse> {
    await this._operatorService.requirePermission(OperatorPermissions.canReturnOrder);
    const returnTransaction = await this._transactionDb.returnTransactionRepository.findOne(
      data.returnOrderId
    );

    const transaction = await this._transactionDb.transactionLogRepository.findOne({
      relations: ['orderLines'],
      where: { transactionId: returnTransaction.returnedTransactionId },
    });

    if (!transaction.canBeReversed) {
      throw new Error('Old transactions cannot be reversed');
    }

    let result: IReturnOrderResponse = { success: true };

    // if (transaction.paymentType == PaymentType.BOG) {
    //   if (transaction.orderDate < this._settings.data.dayCloseDate) {
    //     return { success: false, reversal: { Success: false } };
    //   } else {
    //     result.reversal = await this._deviceService.reverseCardTransaction({
    //       cardProvider: OdinCardProvider.BOG,
    //       externalId: transaction.externalId,
    //     });
    //   }
    // }

    transaction.status = TransactionStatus.Reversed;
    returnTransaction.status = ReturnTransactionStatus.PendingPayment;

    await this._transactionDb.transactionLogRepository.save(transaction);
    await this._transactionDb.returnTransactionRepository.save(returnTransaction);
    await this._transactionDb.returnTransactionLogRepository.save(returnTransaction);

    return result;
  }

  public async finishReturnOrder(data: IFinishReturnOrderRequest) {
    await this._operatorService.requirePermission(OperatorPermissions.canReturnOrder);
    const returnTransaction = await this._transactionDb.returnTransactionRepository.findOne(
      data.returnOrderId
    );
    returnTransaction.status = ReturnTransactionStatus.Finished;

    await this._transactionDb.returnTransactionRepository.save(returnTransaction);
    await this._transactionDb.returnTransactionLogRepository.save(returnTransaction);
  }

  public async cancelReturnOrder(data: IFinishReturnOrderRequest) {
    await this._operatorService.requirePermission(OperatorPermissions.canReturnOrder);
    const returnTransaction = await this._transactionDb.returnTransactionRepository.findOne(
      data.returnOrderId
    );
    returnTransaction.status = ReturnTransactionStatus.Canceled;

    await this._transactionDb.returnTransactionRepository.delete(returnTransaction);
    await this._transactionDb.returnTransactionLogRepository.save(returnTransaction);
    await this._checkService.deleteCurrentCheck(true);
  }
}
