import { TableNotFoundException } from './../../../shared/exceptions/TableNotFoundException';
import { TableService } from './../Space/TableService';
import { SpaceService } from './../Space/SpaceService';
import { OperatorNotAuthedException } from './../../../shared/exceptions/OperatorNotAuthedException';
import { ShiftNotStartedException } from './../../../shared/exceptions/ShiftNotStartedException';
import { injectable, inject } from 'inversify';
import { ApplicationDb } from '../../infrastructure/ApplicationDb';
import { OperatorService } from '../Operator/OperatorService';
import { ShiftService } from '../Shift/ShiftService';
import { CheckQueries } from '../../queries/CheckQueries';
import { Check } from '../../infrastructure/Entities';
import { ICheckItem } from '../../../shared/types/ICheckItem';
import { CommonFunctions } from '../../../shared/CommonFunctions';
import { OperatorPermissions } from '../../../shared/enums/OperatorPermissions';
import { IEntityOrderDetails } from '../../../shared/types/IEntityOrderDetails';
import { OrderService } from '../Order/OrderService';
import { PaymentType } from '../../../shared/types/IOrder';
import { EntityPaymentType } from '../../../shared/types/IEntityOrder';
import { ICheck } from '../../../shared/types/ICheck';
import { IOrderResponse } from '../../../shared/types/IOrderResponse';
import { SettingsService } from '../Settings/SettingService';
import { IMEINotSetException } from '../../../shared/exceptions/IMEINotSetException';
import { OperatorNotFoundException } from '../../../shared/exceptions/OperatorNotFoundException';

@injectable()
export class CheckService {
  private _activeCheck: Check = null;

  constructor(
    @inject(ApplicationDb) private readonly _db: ApplicationDb,
    @inject(OperatorService) private readonly _operatorService: OperatorService,
    @inject(ShiftService) private readonly _shiftService: ShiftService,
    @inject(OrderService) private readonly _orderService: OrderService,
    @inject(SettingsService) private readonly _settings: SettingsService,
    @inject(TableService) private readonly _tableService: TableService
  ) {}

  async order(paymentType: PaymentType): Promise<IOrderResponse> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    const table = await this._tableService.getTableById(this._activeCheck.tableId);

    const result = await this._orderService.order({
      orderId: this._activeCheck.orderId ?? CommonFunctions.generateGuid(),
      orderItems: this._activeCheck.products,
      taxAmount: this._activeCheck.taxAmount,
      taxRate: this._activeCheck.taxRate,
      basketTotalPrice: this._activeCheck.basketTotalPrice,
      totalPrice: this._activeCheck.totalPrice,
      paymentType: paymentType,
      isDetailed: false,
      operatorId: this._operatorService.currentOperatorId,
      receiptNumber: null,
      operatorName: null,
      checkDate: this._activeCheck.creationDate || new Date(),
      tableName: table?.name,
      spaceName: table?.space?.name,
      guestCount: this._activeCheck.guestCount,
      tableId: this._activeCheck.tableId,
    });

    if (result.Success) {
      await this._db.checkRepository.delete({ id: this._activeCheck.id });
      this.unsetActive();
    }

    return result;
  }

  async entityOrder(paymentType: EntityPaymentType): Promise<IOrderResponse> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (!this._activeCheck.legalEntityData) {
      throw new Error('Legal entity data is empty');
    }

    const table = await this._tableService.getTableById(this._activeCheck.tableId);

    const result = await this._orderService.entityOrder({
      orderId: this._activeCheck.orderId ?? CommonFunctions.generateGuid(),
      orderItems: this._activeCheck.products,
      taxAmount: this._activeCheck.taxAmount,
      taxRate: this._activeCheck.taxRate,
      basketTotalPrice: this._activeCheck.basketTotalPrice,
      totalPrice: this._activeCheck.totalPrice,
      paymentType: paymentType,
      isDetailed: false,
      operatorId: this._operatorService.currentOperatorId,
      receiptNumber: null,
      operatorName: null,
      entityIdentifier: this._activeCheck.legalEntityData.entityIdentifier,
      entityName: this._activeCheck.legalEntityData.entityName,
      entityType: this._activeCheck.legalEntityData.entityType,
      hasTransportation: this._activeCheck.legalEntityData.hasTransportation,
      startAddress: this._activeCheck.legalEntityData.startAddress,
      endAddress: this._activeCheck.legalEntityData.endAddress,
      driverPIN: this._activeCheck.legalEntityData.driverPIN,
      driverName: this._activeCheck.legalEntityData.driverName,
      driverCarNumber: this._activeCheck.legalEntityData.driverCarNumber,
      driverIsForeignСitizen: this._activeCheck.legalEntityData.driverIsForeignСitizen,
      transportationType: this._activeCheck.legalEntityData.transportationType,
      transportName: this._activeCheck.legalEntityData.transportName,
      comment: this._activeCheck.legalEntityData.comment,
      checkDate: this._activeCheck.creationDate || new Date(),
      tableName: table?.name,
      spaceName: table?.space?.name,
      guestCount: this._activeCheck.guestCount,
      tableId: this._activeCheck.tableId,
      entityClientId: this._activeCheck.legalEntityData.entityClientId,
    });

    if (result.Success) {
      await this._db.checkRepository.delete({ id: this._activeCheck.id });
      this.unsetActive();
    }

    return result;
  }

  async preOrder(): Promise<IOrderResponse> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    const table = await this._tableService.getTableById(this._activeCheck.tableId);

    return this._orderService.preOrder({
      orderId: CommonFunctions.generateGuid(),
      orderItems: this._activeCheck.products,
      taxRate: this._activeCheck.taxRate,
      taxAmount: this._activeCheck.taxAmount,
      basketTotalPrice: this._activeCheck.basketTotalPrice,
      totalPrice: this._activeCheck.totalPrice,
      isDetailed: false,
      operatorId: this._operatorService.currentOperatorId,
      receiptNumber: null,
      operatorName: null,
      checkDate: this._activeCheck.creationDate || new Date(),
      tableName: table?.name,
      spaceName: table?.space?.name,
      guestCount: this._activeCheck.guestCount,
    });
  }

  async createCheck(tableId?: number, guestCount?: number): Promise<Check> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    return (this._activeCheck = await this._db.checkRepository.save(
      Check.CreateNew(
        CommonFunctions.generateGuid(),
        this._operatorService.currentOperatorId,
        this._shiftService.currentShiftId,
        this._settings.data.taxRate,
        tableId,
        guestCount
      )
    ));
  }

  async setActive(checkId: number): Promise<Check> {
    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    this._activeCheck = await this._db.checkRepository.findOne(checkId);
    try {
      await this.requireOperatorPermission();
      return this._activeCheck;
    } catch (e) {
      this._activeCheck = null;
      throw e;
    }
  }

  getActive(): Check {
    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    this.requireOperatorPermission();
    return this._activeCheck;
  }

  unsetActive(): void {
    this._activeCheck = null;
  }

  async setTaxRate(taxRate: number): Promise<ICheck> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (!this._activeCheck) {
      throw new Error('Activate or create new check');
    }

    this.requireOperatorPermission();

    this._activeCheck.taxRate = taxRate;
    this.calculatePrices();
    return await this._db.checkRepository.save(this._activeCheck);
  }

  async setTable(tableId: number): Promise<Check> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (!this._activeCheck) {
      throw new Error('Activate or create new check');
    }

    const table = await this._db.tableRepository.findOne({ id: tableId });
    if (!table) {
      throw new TableNotFoundException();
    }

    this._activeCheck.tableId = tableId;

    return await this._db.checkRepository.save(this._activeCheck);
  }

  async setOperator(operatorId: number): Promise<Check> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (!this._activeCheck) {
      throw new Error('Activate or create new check');
    }

    this._operatorService.requirePermission(OperatorPermissions.canSeeAllOrders);

    const operator = await this._db.operatorRepository.findOne({ id: operatorId });

    if (!operator) {
      throw new OperatorNotFoundException();
    }

    this._activeCheck.operatorId = operator.id;

    return await this._db.checkRepository.save(this._activeCheck);
  }

  async addItem(item: ICheckItem): Promise<Check> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (!this._activeCheck) {
      throw new Error('Activate or create new check');
    }

    await this.requireOperatorPermission();

    const hasImei = !!(await this._db.imeiRepository.count({
      where: { stockItem: { id: item.stockItemId } },
    }));

    if (hasImei && !item.stockItemIMEI) {
      throw new IMEINotSetException();
    }

    const product = this._activeCheck.products.find(
      (x) =>
        x?.stockItemId == item.stockItemId &&
        (hasImei ? x?.stockItemIMEI == item.stockItemIMEI : true)
    );

    if (product) {
      if (hasImei) {
        return this._activeCheck;
      }
      product.quantity = CommonFunctions.sum(product.quantity, item.quantity, 4);
    } else {
      // this._activeCheck.products.push(item);
      this._activeCheck.products = [item, ...this._activeCheck.products];
    }

    this.calculatePrices();

    return await this._db.checkRepository.save(this._activeCheck);
  }

  async updateItem(item: ICheckItem): Promise<ICheck> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (!this._activeCheck) {
      throw new Error('Activate or create new check');
    }

    this.requireOperatorPermission();

    const hasImei = !!(await this._db.imeiRepository.count({
      where: { stockItem: { id: item.stockItemId } },
    }));

    for (const index in this._activeCheck.products) {
      if (
        this._activeCheck.products[index]?.stockItemId == item.stockItemId &&
        (hasImei ? this._activeCheck.products[index]?.stockItemIMEI == item.stockItemIMEI : true)
      ) {
        this._activeCheck.products[index] = item;
        if (hasImei) {
          this._activeCheck.products[index].quantity = 1;
        }
      }
    }

    this.calculatePrices();

    return await this._db.checkRepository.save(this._activeCheck);
  }

  async removeItem(itemId: number, stockItemIMEI?: string): Promise<Check> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (!this._activeCheck) {
      throw new Error('Activate or create new check');
    }

    await this.requireOperatorPermission(OperatorPermissions.canDeleteFromBasket, true);

    this._activeCheck.products = this._activeCheck.products.filter(
      (item) =>
        !(
          item.stockItemId == itemId &&
          (item.stockItemIMEI ? stockItemIMEI && item.stockItemIMEI == stockItemIMEI : true)
        )
    );

    this.calculatePrices();

    return await this._db.checkRepository.save(this._activeCheck);
  }

  async removeAllItems(): Promise<Check> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (!this._activeCheck) {
      throw new Error('Activate or create new check');
    }

    await this.requireOperatorPermission(OperatorPermissions.canDeleteFromBasket, true);

    this._activeCheck.products = [];
    this.calculatePrices();
    return await this._db.checkRepository.save(this._activeCheck);
  }

  async deleteCheck(
    checkId: number,
    allowEmptyCheckDeletion: boolean = false,
    force: boolean = false
  ): Promise<void> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (allowEmptyCheckDeletion || force) {
      const check = await this._db.checkRepository.findOne({ id: checkId });
      if (!check?.products?.length || force) {
        await this._db.checkRepository.delete({ id: checkId });
        return;
      }
    }

    await this.requireOperatorPermission(OperatorPermissions.canDeleteBasket, true);
    await this._db.checkRepository.delete({ id: checkId });
  }

  async deleteCurrentCheck(force: boolean = false): Promise<void> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (force) {
      await this._db.checkRepository.delete({ id: this._activeCheck?.id });
      return;
    }

    await this.requireOperatorPermission(OperatorPermissions.canDeleteBasket, true);
    await this._db.checkRepository.delete({ id: this._activeCheck?.id });
  }

  async updateGuestCount(guestCount: number): Promise<Check> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (!this._activeCheck) {
      throw new Error('Activate or create new check');
    }

    await this.requireOperatorPermission();
    this._activeCheck.guestCount = guestCount;
    return await this._db.checkRepository.save(this._activeCheck);
  }

  async setLegalEntityData(data: IEntityOrderDetails): Promise<Check> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (!this._activeCheck) {
      throw new Error('Activate or create new check');
    }

    await this.requireOperatorPermission();
    this._activeCheck.legalEntityData = data;
    return await this._db.checkRepository.save(this._activeCheck);
  }

  async unsetLegalEntityData(): Promise<Check> {
    if (!this._shiftService.currentShiftId) {
      throw new ShiftNotStartedException();
    }

    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    if (!this._activeCheck) {
      throw new Error('Activate or create new check');
    }

    await this.requireOperatorPermission();
    this._activeCheck.legalEntityData = null;
    return await this._db.checkRepository.save(this._activeCheck);
  }

  async getChecks(tableId?: number): Promise<Check[]> {
    if (await this._operatorService.hasPermission(OperatorPermissions.canSeeAllOrders)) {
      return await new CheckQueries(this._db).getChecks(null, tableId);
    } else {
      return await new CheckQueries(this._db).getChecks(
        this._operatorService.currentOperatorId,
        tableId
      );
    }
  }

  async removeUnusedChecks(operatorId: number) {
    if (!operatorId) {
      throw new OperatorNotAuthedException();
    }

    return await new CheckQueries(this._db).deleteOperatorUnusedCehcks(operatorId);
  }

  async operatorHasChecks(operatorId?: number): Promise<boolean> {
    return await new CheckQueries(this._db).operatorHasChecks(
      operatorId ? operatorId : this._operatorService.currentOperatorId
    );
  }

  async operatorHasActiveChecks(operatorId?: number): Promise<boolean> {
    return await new CheckQueries(this._db).operatorHasActiveChecks(
      operatorId ? operatorId : this._operatorService.currentOperatorId
    );
  }

  private async requireOperatorPermission(
    permission?: OperatorPermissions,
    canBeElevated = false
  ): Promise<void> {
    if (this._operatorService.currentOperatorId != this._activeCheck.operatorId) {
      await this._operatorService.requirePermission(
        OperatorPermissions.canSeeAllOrders,
        canBeElevated
      );
    } else if (permission) {
      await this._operatorService.requirePermission(permission, canBeElevated);
    }
  }

  private calculatePrices(): void {
    this._activeCheck.basketTotalPrice = 0;
    this._activeCheck.products.forEach((product) => {
      if (product.discountRate || product.discountRate === 0) {
        product.unitPrice = CommonFunctions.calculatePercent(
          product.initialUnitPrice,
          CommonFunctions.subtraction(100, product.discountRate)
        );
      }

      product.totalPrice = CommonFunctions.multiply(product.quantity, product.unitPrice);

      this._activeCheck.basketTotalPrice = CommonFunctions.sum(
        this._activeCheck.basketTotalPrice,
        product.totalPrice
      );
    });

    this._activeCheck.taxAmount = CommonFunctions.calculatePercent(
      this._activeCheck.taxRate,
      this._activeCheck.basketTotalPrice
    );

    this._activeCheck.totalPrice = CommonFunctions.sum(
      this._activeCheck.basketTotalPrice,
      this._activeCheck.taxAmount
    );
  }
}
