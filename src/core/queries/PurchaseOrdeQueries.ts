import { Like } from 'typeorm';
import { PurchaseOrderStatus } from '../../shared/enums/PurchaseOrderStatus';
import { ApplicationDb } from '../infrastructure/ApplicationDb';
import { PurchaseOrder } from './../infrastructure/Entities';

export class PurchaseOrderQueries {
  constructor(private readonly _db: ApplicationDb) {}

  async getPurchaseOrders(
    keyWord: string,
    pageIndex: number,
    pageSize: number,
    purchaseOrderId?: number
  ): Promise<PurchaseOrder[]> {
    const where: any = [
      {
        name: Like(`%${keyWord}%`),
        status: PurchaseOrderStatus.Ordered,
      },
      {
        name: Like(`%${keyWord}%`),
        status: PurchaseOrderStatus.Delayed,
      },
    ];

    if (purchaseOrderId) {
      where.id = purchaseOrderId;
    }

    return await this._db.purchaseOrderRepository.find({
      where,
      order: { expectedReceiveDate: 'ASC' },
      relations: ['supplier', 'purchaseOrderLines', 'purchaseOrderLines.stockItem'],
      skip: pageIndex * pageSize,
      take: pageSize,
    });
  }

  async countPurchaseOrders(
    keyWord: string,
    pageIndex: number,
    pageSize: number,
    purchaseOrderId?: number
  ): Promise<number> {
    const where: any = [
      {
        name: Like(`%${keyWord}%`),
        status: PurchaseOrderStatus.Ordered,
      },
      {
        name: Like(`%${keyWord}%`),
        status: PurchaseOrderStatus.Delayed,
      },
    ];

    if (purchaseOrderId) {
      where.id = purchaseOrderId;
    }

    return await this._db.purchaseOrderRepository.count({
      where,
      order: { expectedReceiveDate: 'ASC' },
      relations: ['supplier', 'purchaseOrderLines', 'purchaseOrderLines.stockItem'],
      skip: pageIndex * pageSize,
      take: pageSize,
    });
  }
}
