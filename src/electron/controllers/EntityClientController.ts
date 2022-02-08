import { EntityClientQueries } from './../../core/queries/EntityClientQueries';
import { IEntityClient } from './../../shared/types/IEntityClient';
import { inject, injectable } from 'inversify';
import { ApplicationDb } from '../../core/infrastructure/ApplicationDb';
import { IPaginatedResult } from '../../shared/types/IPaginatedResult';
import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { IResult } from '../../shared/types/IResult';

@IpcController()
@injectable()
export class EntityClientController {
  constructor(@inject(ApplicationDb) private readonly _db: ApplicationDb) {}

  @IpcMain('getAllEntityClients')
  async getAllProducts(): Promise<IResult<IEntityClient[]>> {
    const query = new EntityClientQueries(this._db);
    return {
      data: await query.getAllEntityClients(),
    };
  }

  @IpcMain('getEntityClients')
  async getProducts(arg): Promise<IPaginatedResult<IEntityClient[]>> {
    const query = new EntityClientQueries(this._db);
    return {
      data: await query.getEntityClients(arg.keyWord, arg.pageIndex, arg.pageSize),
      count: await query.countEntityClients(arg.keyWord),
    };
  }
}
