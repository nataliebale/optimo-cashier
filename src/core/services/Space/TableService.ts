import { injectable, inject } from 'inversify';
import { ApplicationDb } from '../../infrastructure/ApplicationDb';
import { ITableWithStatus } from '../../../shared/types/ITableWithStatus';
import { SpaceQueries } from '../../queries/SpaceQueries';
import { Table } from '../../infrastructure/Entities';

@injectable()
export class TableService {
  public currentShiftId?: number;

  constructor(@inject(ApplicationDb) private readonly _db: ApplicationDb) {}

  async getTables(spaceId: number): Promise<Table[]> {
    // console.log('devppp => getTables');
    return await this._db.tableRepository.find({ where: { spaceId: spaceId, status: 1 } });
  }

  async getTablesWithStatus(spaceId: number): Promise<ITableWithStatus[]> {
    return await new SpaceQueries(this._db).getTablesWithStatus(spaceId);
  }

  async getTableById(tableId: number): Promise<Table> {
    return await this._db.tableRepository.findOne({
      where: { id: tableId },
      relations: ['space'],
    });
  }
}
