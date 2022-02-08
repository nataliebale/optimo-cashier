import { TransactionLogOrderLine } from './../../infrastructure/Entities';
import { TransactionLog } from './../../infrastructure/Entities';
import * as Big from 'big.js';
import * as log from 'electron-log';
import { inject, injectable } from 'inversify';
import { CommonFunctions } from '../../../shared/CommonFunctions';
import { EntityPaymentMethods } from '../../../shared/enums/EntityPaymentMethods';
import { Environment } from '../../../shared/enums/Environment';
import { OdinEvent } from '../../../shared/enums/OdinEvent';
import { PaymentMethods } from '../../../shared/enums/PaymentMethods';
import { CartIsEmptyException } from '../../../shared/exceptions/CartIsEmptyException';
import { DayNotClosedException } from '../../../shared/exceptions/DayNotClosedException';
import { IMEINotSetException } from '../../../shared/exceptions/IMEINotSetException';
import { ModelValidationException } from '../../../shared/exceptions/ModelValidationException';
import { OperatorNotAuthedException } from '../../../shared/exceptions/OperatorNotAuthedException';
import { OrderIdExistsException } from '../../../shared/exceptions/OrderIdExistsException';
import { IBaseOrder } from '../../../shared/types/IBaseOrder';
import { EntityPaymentType } from '../../../shared/types/IEntityOrder';
import { PaymentType } from '../../../shared/types/IOrder';
import { ApplicationDb } from '../../infrastructure/ApplicationDb';
import {
  EntityTransaction,
  ReceivedPurchaseOrder,
  Transaction,
} from '../../infrastructure/Entities';
import { DeviceService } from '../Device/DeviceService';
import { HttpAdapter } from '../Http/HttpAdapter';
import { OperatorService } from '../Operator/OperatorService';
import { SettingsService } from '../Settings/SettingService';
import { ShiftService } from '../Shift/ShiftService';
import { SynchronizationService } from '../Synchronization/SynchronizationService';
import { SystemEventService } from '../SystemEvent/SystemEventService';
import { EntityOrder } from './models/EntityOrder';
import { Order } from './models/Order';
import { ReceivedOrder } from './models/ReceivedOrder';
import { IOrderResponse } from '../../../shared/types/IOrderResponse';
import { CheckService } from '../Check/CheckService';
import { OperatorPermissions } from '../../../shared/enums/OperatorPermissions';
import { TransactionDb } from '../../infrastructure/TransactionDb';

@injectable()
export class OrderService {
  constructor(
    @inject(ApplicationDb) private readonly _db: ApplicationDb,
    @inject(TransactionDb) private readonly _transactionDb: TransactionDb,
    @inject(ShiftService) private readonly _shiftService: ShiftService,
    @inject(OperatorService) private readonly _operatorService: OperatorService,
    @inject(SettingsService) private readonly _settings: SettingsService,
    @inject(DeviceService) private readonly _deviceService: DeviceService,
    @inject(SystemEventService)
    private readonly _systemEventService: SystemEventService,
    @inject(SynchronizationService)
    private readonly _syncService: SynchronizationService
  ) {}

  async order(order: Order) {
    if (
      await this._db.transactionRepository.findOne({
        transactionId: order.orderId,
      })
    ) {
      throw new OrderIdExistsException();
    }

    await this._operatorService.requirePermission(OperatorPermissions.canOrder);

    const lastTransaction = await this._transactionDb.query(`
      SELECT COALESCE('s'.'seq', 0) seq
        FROM 'sqlite_sequence' 's'
       WHERE 's'.'name' = 'transaction'`);

    await this.prepareOrder(order, lastTransaction[0]['seq'] + 1);

    let result: IOrderResponse = null;

    if (order.paymentType != PaymentType.Manual) {
      result = await this._deviceService.order(order);
    } else {
      result = {
        Success: true,
      };
    }
    const transaction = Transaction.CreateNew(
      order.orderDate,
      this._operatorService.currentOperatorId,
      order.paymentType == PaymentType.Cash
        ? PaymentMethods.Cash
        : order.paymentType == PaymentType.Manual
        ? PaymentMethods.Manual
        : PaymentMethods.Card,
      order.paymentType,
      order.orderId,
      order.taxAmount,
      order.taxRate,
      order.orderItems,
      (await this._shiftService.getCurrentShift()).id,
      order.totalPrice,
      order.guestCount,
      order.tableId
    );

    if (result && result.Transaction) {
      transaction.transactionDescription = JSON.stringify(result.Transaction);
    }

    if (result && result.ExternalId) {
      transaction.externalId = result.ExternalId;
    }

    if (result.Success) {
      await this._transactionDb.transactionRepository.save(transaction);
      await this._transactionDb.transactionLogRepository.insert(transaction);
      transaction.orderLines.forEach((item: TransactionLogOrderLine) => {
        item.transaction = transaction as TransactionLog;
      });
      await this._transactionDb.transactionLogOrderLineRepository.insert(transaction.orderLines);
      log.info(
        `გაყიდვა ${transaction.transactionId} შენახულია ლოკალურად და აისახება სინქრონიზაციის მერე`
      );
    }

    return result;
  }

  async preOrder(order: IBaseOrder) {
    await this.prepareOrder(order, 0, false);
    return await this._deviceService.preOrder(order);
  }

  async entityOrder(order: EntityOrder) {
    if (
      await this._db.transactionRepository.findOne({
        transactionId: order.orderId,
      })
    ) {
      throw new OrderIdExistsException();
    }

    await this._operatorService.requirePermission(OperatorPermissions.canOrder);

    const lastTransaction = await this._transactionDb.query(`
      SELECT COALESCE('s'.'seq', 0) seq
        FROM 'sqlite_sequence' 's'
       WHERE 's'.'name' = 'entity_transaction'`);

    await this.prepareOrder(order, lastTransaction[0]['seq'] + 1);

    log.info(`total price: ${order.totalPrice}`);

    let result: IOrderResponse = null;

    if (order.paymentType != EntityPaymentType.Consignation) {
      result = await this._deviceService.order(order);
    } else {
      result = {
        Success: true,
      };
    }
    const transaction = EntityTransaction.CreateNew(
      order.entityIdentifier,
      order.entityName,
      order.entityType,
      order.orderDate,
      order.hasTransportation,
      order.startAddress,
      order.endAddress,
      order.paymentType == EntityPaymentType.Cash
        ? EntityPaymentMethods.Cash
        : order.paymentType == EntityPaymentType.Consignation
        ? EntityPaymentMethods.Consignation
        : EntityPaymentMethods.Card,
      order.paymentType,
      order.orderId,
      order.taxAmount,
      order.taxRate,
      order.orderItems,
      (await this._shiftService.getCurrentShift()).id,
      order.totalPrice,
      order.driverPIN,
      order.driverName,
      order.driverCarNumber,
      order.driverIsForeignСitizen,
      order.transportationType,
      order.transportName,
      order.comment,
      order.operatorId,
      null,
      order.entityClientId,
      order.guestCount,
      order.tableId
    );

    if (result && result.Transaction) {
      transaction.transactionDescription = JSON.stringify(result.Transaction);
    }

    if (result && result.ExternalId) {
      transaction.externalId = result.ExternalId;
    }

    if (result.Success) {
      await this._transactionDb.entityTransactionRepository.save(transaction);
      await this._transactionDb.entityTransactionLogRepository.save(transaction);
      // log.info('dev => saved transaction in log:', transaction);
      log.info(
        `გაყიდვა ${transaction.transactionId} შენახულია ლოკალურად და აისახება სინქრონიზაციის მერე`
      );
    }

    return result;
  }

  async receiveOrder(order: ReceivedOrder) {
    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    order.orderLines.forEach((element) => {
      if (!element.receivedQuantity) {
        throw new ModelValidationException('receivedQuantity required');
      }
      if (!element.receivedUnitCost) {
        throw new ModelValidationException('receivedUnitCost required');
      }
    });

    await this._db.receivedPurchaseOrderLogRepository.save(
      await this._db.receivedPurchaseOrderRepository.save(
        ReceivedPurchaseOrder.CreateNew(order.id, order.receiveDate, order.orderLines)
      )
    );

    try {
      await this._syncService.syncReceivedOrders();
      await this._syncService.syncPurchaseOrders();
      await this._syncService.syncStockItems();
      this._systemEventService.sendEvent(OdinEvent.RECEIVED_ORDER_SYNCED, true);
    } catch (err) {
      log.warn('შეკვეთის მიღებისას მარაგების განახლების დროს დაფიქსირდა შეცდომა', err);
    }

    return true;
  }

  private async prepareOrder(order: IBaseOrder, receiptNumber: number, checkCloseDay = true) {
    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (!order || !order.orderItems || order.orderItems.length == 0) {
      throw new CartIsEmptyException(); // also in dll
    }

    order.operatorId = this._operatorService.currentOperatorId;

    const closeDay = this._settings.data.dayCloseDate;
    const dateDiff = new Date().getTime() - closeDay.getTime();

    if (dateDiff > 82800000) {
      // 23h
      this._systemEventService.sendEvent(OdinEvent.DAY_TO_BE_CLOSED, true);
    }

    if (checkCloseDay) {
      if (dateDiff > 88200000) {
        // 24.5h
        throw new DayNotClosedException();
      }
    }

    const operator = await this._operatorService.getCurrentOperator();
    order.totalPrice = 0;
    order.basketTotalPrice = 0;
    order.operatorName = operator.name;
    order.receiptNumber = receiptNumber;
    order.orderDate = new Date();

    order.orderItems.forEach((el) => {
      el.totalPrice = CommonFunctions.multiply(el.quantity, el.unitPrice);
      el.unitPrice = parseFloat(new Big(el.totalPrice).div(el.quantity).toFixed(10));
      order.basketTotalPrice = CommonFunctions.sum(order.basketTotalPrice, el.totalPrice);
    });

    order.taxAmount = CommonFunctions.calculatePercent(order.basketTotalPrice, order.taxRate);
    order.totalPrice = CommonFunctions.sum(order.basketTotalPrice, order.taxAmount);

    // check imeis
    for (const orderItem of order.orderItems) {
      if (
        (await this._db.imeiRepository.findOne({
          where: { stockItem: orderItem.stockItemId, status: 0 },
        })) &&
        !orderItem.stockItemIMEI
      ) {
        throw new IMEINotSetException();
      }
    }

    log.info(`total price: ${order.totalPrice}`);
  }
}
