import { OperatorPermissions } from './../../../shared/enums/OperatorPermissions';
import { CashWithdrawal } from '../../infrastructure/Entities';
import { SynchronizationService } from '../Synchronization/SynchronizationService';
import * as log from 'electron-log';
import { inject, injectable } from 'inversify';
import { OperatorNotAuthedException } from '../../../shared/exceptions/OperatorNotAuthedException';
import { ShiftNotStartedException } from '../../../shared/exceptions/ShiftNotStartedException';
import { ShiftStartedException } from '../../../shared/exceptions/ShiftStartedException';
import { ICashWithdrawal } from '../../../shared/types/ICashWithdrawal';
import { IShift } from '../../../shared/types/IShift';
import { ApplicationDb } from '../../infrastructure/ApplicationDb';
import { OperatorService } from '../Operator/OperatorService';
import { Shift } from '../../infrastructure/Entities';
import { ShiftAction, ShiftActionType } from '../../infrastructure/Entities';
import { PaymentMethods } from '../../../shared/enums/PaymentMethods';
import { EntityPaymentMethods } from '../../../shared/enums/EntityPaymentMethods';
import { IShiftTotalSales } from '../../../shared/types/IShiftTotalSale';
import { TransactionDb } from '../../infrastructure/TransactionDb';
import { ShiftStartedByOthersException } from '../../../shared/exceptions/ShiftStartedByOthersException';

@injectable()
export class ShiftService {
  public currentShiftId?: number;

  constructor(
    @inject(ApplicationDb) private readonly _db: ApplicationDb,
    @inject(SynchronizationService) private readonly _syncService: SynchronizationService,
    @inject(OperatorService) private readonly _operatorService: OperatorService,
    @inject(TransactionDb) private readonly _transactionDb: TransactionDb
  ) {}

  async Run() {
    if (!this.currentShiftId) {
      const currentShift = await this._db.shiftRepository.findOne({ finished: false });

      if (currentShift) {
        this.currentShiftId = currentShift.id;
      }
    }
  }

  async getShift(): Promise<IShift> {
    return await this._db.shiftRepository.findOne(this.currentShiftId);
  }

  async startShift(cashBegin: number): Promise<void> {
    if (!this._operatorService.currentOperatorId) {
      log.warn('ცვლის დასაწყებად გაიარეთ ავტორიზაცია');
      throw new OperatorNotAuthedException();
    }

    if (this.currentShiftId) {
      log.warn('ცვლა უკვე დაწყებულია');
      throw new ShiftStartedException();
    }

    await this._operatorService.requirePermission(OperatorPermissions.canOpenShift);

    let shift: IShift = {
      startOperatorId: this._operatorService.currentOperatorId,
      cashBegin: cashBegin,
      dateBegin: new Date(),
      finished: false,
    };

    shift = await this._db.shiftRepository.save(shift);
    this.currentShiftId = shift.id;

    await this._db.shiftActionRepository.save(
      ShiftAction.CreateNew(
        ShiftActionType.Start,
        this.currentShiftId,
        shift.startOperatorId,
        cashBegin,
        shift.dateBegin
      )
    );

    this._syncService.syncShiftActions();
  }

  async endShift(cashEnd: number): Promise<void> {
    if (!this.currentShiftId) {
      log.warn('ცვლა არ არის გახსნილი');
      throw new ShiftNotStartedException();
    }

    await this._operatorService.requirePermission(OperatorPermissions.canOpenShift);

    const shift = await this._db.shiftRepository.findOne(this.currentShiftId);
    shift.endShift(this._operatorService.currentOperatorId, cashEnd, new Date());

    // TODO: leave only else block
    if (shift.withdrawals && shift.withdrawals.length > 0) {
      await this._db.shiftRepository.save(shift);
      this._syncService.syncShifts();
    } else {
      await this._db.shiftRepository.delete(shift.id);
      await this._db.shiftActionRepository.save(
        ShiftAction.CreateNew(
          ShiftActionType.End,
          this.currentShiftId,
          shift.endOperatorId,
          shift.cashEnd,
          shift.dateEnd
        )
      );
      this._syncService.syncShiftActions();
    }

    await this._db.shiftLogRepository.save(shift);
    this._syncService
      .sync()
      .then()
      .catch((e) => log.warn(e));
    this.currentShiftId = null;
  }

  async withdrawCash(data: ICashWithdrawal): Promise<void> {
    // console.log(data);
    if (!this._operatorService.currentOperatorId) {
      log.error('მოლარის სესია არ არის გახსნილი');
      throw new OperatorNotAuthedException();
    }

    if (!this.currentShiftId) {
      log.error('ცვლა არ არის გახსნილი');
      throw new ShiftNotStartedException();
    }

    await this._operatorService.requirePermission(OperatorPermissions.canWithdrawCash);

    if (!data.withdrawalDate) {
      data.withdrawalDate = new Date();
    }

    await this._db.cashWithdrawalLogRepository.save(
      await this._db.cashWithdrawalRepository.save(
        CashWithdrawal.CreateNew(
          this.currentShiftId,
          this._operatorService.currentOperatorId,
          data.amount,
          data.reason,
          data.withdrawalDate
        )
      )
    );
  }

  async getCurrentShift(): Promise<Shift> {
    return await this._db.shiftRepository.findOne(this.currentShiftId);
  }

  async getShiftTotalSalesAmount(): Promise<IShiftTotalSales> {
    log.info('getShiftTotalSalesAmount');
    if (!this.currentShiftId) {
      log.warn('ცვლა არ არის გახსნილი');
      throw new ShiftNotStartedException();
    }

    await this._operatorService.requirePermission(OperatorPermissions.canSeeShiftSums);

    const shiftTotalSalesAmount = {
      shiftId: this.currentShiftId,
      entitySale: {
        totalAmount: 0,
        totalCash: 0,
        totalCard: 0,
        totalConsignation: 0,
      },
      individualSale: {
        totalAmount: 0,
        totalCash: 0,
        totalCard: 0,
        totalManual: 0,
      },
    };

    // SELECT tl.paymentMethod AS paymentMethod, SUM(tl.orderTotalPrice) AS paymentMethodSum
    // FROM transaction_log tl
    // WHERE tl.shiftId = ${this.currentShiftId}
    // GROUP BY tl.paymentMethod
    const shiftSalesQuery = `
      SELECT tl.paymentMethod AS paymentMethod, SUM(tl.orderTotalPrice) AS paymentMethodSum
      FROM transaction_log tl
      LEFT JOIN return_transaction_log rtl
        ON  rtl.newTransactionId = tl.transactionId
        AND rtl.status IS NOT 99
	    LEFT JOIN transaction_log tl2
	      ON  rtl.returnedTransactionId = tl2.transactionId
		    AND tl.shiftId = tl2.shiftId
      WHERE
		    tl.status = 0
		    AND tl.shiftId = ${this.currentShiftId}
		    AND (rtl.id IS NULL OR (rtl.id IS NOT NULL AND tl2.id IS NOT NULL))
      GROUP BY tl.paymentMethod
    `;
    const shiftSales = await this._transactionDb.transactionLogRepository.query(shiftSalesQuery);

    // console.log('dev => shiftSalesQuery', shiftSalesQuery);

    shiftSales.forEach((saleAmount) => {
      const paymentSum = parseFloat(saleAmount.paymentMethodSum.toFixed(10));
      switch (saleAmount.paymentMethod) {
        case PaymentMethods.Card:
          shiftTotalSalesAmount.individualSale.totalCard = paymentSum;
          break;
        case PaymentMethods.Cash:
          shiftTotalSalesAmount.individualSale.totalCash = paymentSum;
          break;
        case PaymentMethods.Manual:
          shiftTotalSalesAmount.individualSale.totalManual = paymentSum;
          break;
      }
      // this does not include manual sale
      shiftTotalSalesAmount.individualSale.totalAmount =
        shiftTotalSalesAmount.individualSale.totalCash +
        shiftTotalSalesAmount.individualSale.totalCard;
    });

    const shiftSalesEntityQuery = `
      SELECT etl.paymentMethod AS paymentMethod, SUM(etl.orderTotalPrice) AS paymentMethodSum FROM entity_transaction_log etl WHERE etl.shiftId = ${this.currentShiftId} GROUP BY etl.paymentMethod
    `;
    const shiftEntitySales = await this._transactionDb.transactionLogRepository.query(
      shiftSalesEntityQuery
    );

    // console.log('dev => shiftSalesEntityQuery', shiftSalesEntityQuery);

    shiftEntitySales.forEach((saleAmount) => {
      const paymentSum = parseFloat(saleAmount.paymentMethodSum.toFixed(10));
      switch (saleAmount.paymentMethod) {
        case EntityPaymentMethods.Card:
          shiftTotalSalesAmount.entitySale.totalCard = paymentSum;
          break;
        case EntityPaymentMethods.Cash:
          shiftTotalSalesAmount.entitySale.totalCash = paymentSum;
          break;
        case EntityPaymentMethods.Consignation:
          shiftTotalSalesAmount.entitySale.totalConsignation = paymentSum;
          break;
      }
      shiftTotalSalesAmount.entitySale.totalAmount =
        shiftTotalSalesAmount.entitySale.totalCard +
        shiftTotalSalesAmount.entitySale.totalCash +
        shiftTotalSalesAmount.entitySale.totalConsignation;
    });

    return shiftTotalSalesAmount;
  }
}
