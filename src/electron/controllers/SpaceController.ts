import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { injectable, inject } from 'inversify';
import { IResult } from '../../shared/types/IResult';
import { ISpace } from '../../shared/types/ISpace';
import { SpaceService } from '../../core/services/Space/SpaceService';
import { ITableWithStatus } from '../../shared/types/ITableWithStatus';
import { TableService } from '../../core/services/Space/TableService';

@IpcController()
@injectable()
export class SpaceController {
  constructor(
    @inject(SpaceService) private readonly _spaceService: SpaceService,
    @inject(TableService) private readonly _tableService: TableService,
  ) {}

  @IpcMain('getSpaces')
  async getSpaces(): Promise<IResult<ISpace[]>> {
    return { data: await this._spaceService.getSpaces() };
  }

  @IpcMain('getTablesWithStatus')
  async getTablesWithStatus(spaceId: number): Promise<IResult<ITableWithStatus[]>> {
    return { data: await this._tableService.getTablesWithStatus(spaceId) };
  }
}
