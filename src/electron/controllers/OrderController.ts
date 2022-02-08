import { IFinishReturnOrderRequest } from './../../shared/types/IFinishReturnOrderRequest';
import { IReturnOrderRequest } from './../../shared/types/IReturnOrderRequest';
import { ReturnOrderService } from './../../core/services/Order/ReturnOrderService';
import { ICreateReturnOrderRequest } from '../../shared/types/ICreateReturnOrderRequest';
import { inject, injectable } from 'inversify';
import { ApplicationDb } from '../../core/infrastructure/ApplicationDb';
import { PurchaseOrderQueries } from '../../core/queries/PurchaseOrdeQueries';
import { DeviceService } from '../../core/services/Device/DeviceService';
import { EntityOrder } from '../../core/services/Order/models/EntityOrder';
import { Order } from '../../core/services/Order/models/Order';
import { OrderService } from '../../core/services/Order/OrderService';
import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { IResult } from '../../shared/types/IResult';
import { IPaginatedResult } from '../../shared/types/IPaginatedResult';
import { PurchaseOrder } from '../../core/infrastructure/Entities';
import { IOrderResponse } from '../../shared/types/IOrderResponse';

@IpcController()
@injectable()
export class OrderController {
  constructor(
    @inject(ApplicationDb) private readonly _db: ApplicationDb,
    @inject(OrderService) private readonly _orderService: OrderService,
    @inject(DeviceService) private readonly _deviceService: DeviceService,
    @inject(ReturnOrderService) private readonly _returnOrderService: ReturnOrderService
  ) {}

  @IpcMain('order')
  async order(order: Order): Promise<IResult<IOrderResponse>> {
    return { data: await this._orderService.order(order) };
  }

  @IpcMain('preOrder')
  async preOrder(order: Order): Promise<IResult<IOrderResponse>> {
    return { data: await this._orderService.preOrder(order) };
  }

  @IpcMain('entityOrder')
  async entityOrder(order: EntityOrder): Promise<IResult<any>> {
    return { data: await this._orderService.entityOrder(order) };
  }

  @IpcMain('getPurchaseOrders')
  async getPurchaseOrders(models): Promise<IPaginatedResult<PurchaseOrder[]>> {
    const query = new PurchaseOrderQueries(this._db);
    return {
      data: await query.getPurchaseOrders(
        models.keyWord,
        models.pageIndex,
        models.pageSize,
        models.purchaseOrderId
      ),
      count: await query.countPurchaseOrders(
        models.keyWord,
        models.pageIndex,
        models.pageSize,
        models.purchaseOrderId
      ),
    };
  }

  @IpcMain('receiveOrder')
  async receiveOrder(order) {
    return { data: await this._orderService.receiveOrder(order) };
  }

  @IpcMain('createReturnOrder')
  async createReturnOrder(order: ICreateReturnOrderRequest) {
    return { data: await this._returnOrderService.createReturnOrder(order) };
  }

  @IpcMain('returnOrder')
  async returnOrder(order: IReturnOrderRequest) {
    return { data: await this._returnOrderService.returnOrder(order) };
  }

  @IpcMain('finishReturnOrder')
  async finishReturnOrder(order: IFinishReturnOrderRequest) {
    return { data: await this._returnOrderService.finishReturnOrder(order) };
  }

  @IpcMain('cancelReturnOrder')
  async cancelReturnOrder(order: IFinishReturnOrderRequest) {
    return { data: await this._returnOrderService.cancelReturnOrder(order) };
  }
}
