import { IRemoveCheckRequest } from './../../shared/types/IRemoveCheckItemRequest';
import { injectable, inject } from 'inversify';
import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { CheckService } from '../../core/services/Check/CheckService';
import { IResult } from '../../shared/types/IResult';
import { IOrderResponse } from '../../shared/types/IOrderResponse';
import { PaymentType } from '../../shared/types/IOrder';
import { EntityPaymentType } from '../../shared/types/IEntityOrder';
import { ICheck } from '../../shared/types/ICheck';
import { ICreateCheckRequest } from '../../shared/types/ICreateCheckRequest';
import { ICheckItem } from '../../shared/types/ICheckItem';
import { IEntityOrderDetails } from '../../shared/types/IEntityOrderDetails';

@IpcController()
@injectable()
export class CheckController {
  constructor(@inject(CheckService) private readonly _checkService: CheckService) {}

  @IpcMain('check/setTable')
  async setTable(tableId: number): Promise<IResult<ICheck>> {
    return { data: await this._checkService.setTable(tableId) };
  }

  @IpcMain('check/setOperator')
  async setOperator(operatorId: number): Promise<IResult<ICheck>> {
    return { data: await this._checkService.setOperator(operatorId) };
  }

  @IpcMain('check/order')
  async order(paymentType: PaymentType): Promise<IResult<IOrderResponse>> {
    return { data: await this._checkService.order(paymentType) };
  }

  @IpcMain('check/entityOrder')
  async entityOrder(paymentType: EntityPaymentType): Promise<IResult<IOrderResponse>> {
    return { data: await this._checkService.entityOrder(paymentType) };
  }

  @IpcMain('check/preOrder')
  async preOrder(): Promise<IResult<IOrderResponse>> {
    return { data: await this._checkService.preOrder() };
  }

  @IpcMain('check/setActive')
  async setActive(checkId: number): Promise<IResult<ICheck>> {
    return { data: await this._checkService.setActive(checkId) };
  }

  @IpcMain('check/create')
  async create(data: ICreateCheckRequest): Promise<IResult<ICheck>> {
    return { data: await this._checkService.createCheck(data.tableId, data.guestCount) };
  }

  @IpcMain('check/getActive')
  async getActive(): Promise<IResult<ICheck>> {
    return { data: this._checkService.getActive() };
  }

  @IpcMain('check/unsetActive')
  async unsetActive(): Promise<IResult<void>> {
    return { data: this._checkService.unsetActive() };
  }

  @IpcMain('check/getChecks')
  async getChecks(tableId?: number): Promise<IResult<ICheck[]>> {
    return { data: await this._checkService.getChecks(tableId) };
  }

  @IpcMain('check/hasActiveChecks')
  async hasActiveCehcks(operatorId?: number): Promise<IResult<boolean>> {
    return { data: await this._checkService.operatorHasActiveChecks(operatorId) };
  }

  @IpcMain('check/setTaxRate')
  async setTaxRate(taxRate: number): Promise<IResult<ICheck>> {
    return { data: await this._checkService.setTaxRate(taxRate) };
  }

  @IpcMain('check/addItem')
  async addItem(item: ICheckItem): Promise<IResult<ICheck>> {
    return { data: await this._checkService.addItem(item) };
  }

  @IpcMain('check/updateItem')
  async updateItem(item: ICheckItem): Promise<IResult<ICheck>> {
    return { data: await this._checkService.updateItem(item) };
  }

  @IpcMain('check/removeItem')
  async removeItem(data: IRemoveCheckRequest): Promise<IResult<ICheck>> {
    return { data: await this._checkService.removeItem(data.itemId, data.stockItemIMEI) };
  }

  @IpcMain('check/removeAllItems')
  async removeAllItems(): Promise<IResult<ICheck>> {
    return { data: await this._checkService.removeAllItems() };
  }

  @IpcMain('check/deleteCheck')
  async deleteCheck(checkId: number): Promise<IResult<void>> {
    return { data: await this._checkService.deleteCheck(checkId) };
  }

  @IpcMain('check/setLegalEntityData')
  async setLegalEntityData(data: IEntityOrderDetails): Promise<IResult<ICheck>> {
    return { data: await this._checkService.setLegalEntityData(data) };
  }

  @IpcMain('check/unsetLegalEntityData')
  async unsetLegalEntityData(): Promise<IResult<ICheck>> {
    return { data: await this._checkService.unsetLegalEntityData() };
  }

  @IpcMain('check/operatorHasChecks')
  async operatorHasChecks(operatorId?: number): Promise<IResult<boolean>> {
    return { data: await this._checkService.operatorHasChecks(operatorId) };
  }

  @IpcMain('check/updateGuestCount')
  async updateGuestCount(guestCount: number): Promise<IResult<ICheck>> {
    return { data: await this._checkService.updateGuestCount(guestCount) };
  }
}
