import { inject, injectable } from 'inversify';
import { ApplicationDb } from '../../core/infrastructure/ApplicationDb';
import { StockItemQueries } from '../../core/queries/StockItemQueries';
import { SupplierQueries } from '../../core/queries/SupplierQueries';
import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { IResult } from '../../shared/types/IResult';
import { StockItem, IMEI, StockItemCategory, Supplier } from '../../core/infrastructure/Entities';
import { IPaginatedResult } from '../../shared/types/IPaginatedResult';

@IpcController()
@injectable()
export class ProductController {
  constructor(@inject(ApplicationDb) private readonly _db: ApplicationDb) {}

  @IpcMain('getProductByBarcode')
  async getProductByBarcode(data): Promise<IResult<StockItem[]>> {
    const query = new StockItemQueries(this._db);
    return { data: await query.getProductByBarcode(data) };
  }

  @IpcMain('getProducts')
  async getProducts(arg): Promise<IPaginatedResult<StockItem[]>> {
    const query = new StockItemQueries(this._db);
    return {
      data: await query.getProducts(
        arg.keyWord,
        arg.pageIndex,
        arg.pageSize,
        arg.category,
        arg.topSold,
        arg.supplier,
        arg.forDashboard
      ),
      count: await query.countProducts(arg.keyWord, arg.category, arg.supplier, arg.forDashboard),
    };
  }

  @IpcMain('getIMEISByStockItem')
  async getIMEISByStockItem(data): Promise<IResult<IMEI[]>> {
    const query = new StockItemQueries(this._db);
    return await query.getIMEISByStockItem(data);
  }

  @IpcMain('getCategories')
  async getCategories(data): Promise<IPaginatedResult<StockItemCategory[]>> {
    const query = new StockItemQueries(this._db);
    return {
      data: await query.getCategories(
        data.pageIndex,
        data.pageSize,
        data.name,
        data.parentId,
        data.all
      ),
      count: await query.countCategories(data.name, data.parentId, data.all),
    };
  }

  @IpcMain('getSuppliers')
  async getSuppliers(data): Promise<IPaginatedResult<Supplier[]>> {
    const query = new SupplierQueries(this._db);
    return {
      data: await query.getSuppliers(data.pageIndex, data.pageSize, data.name),
      count: await query.countSuppliers(data.name),
    };
  }
}
