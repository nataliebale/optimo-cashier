import { inject, injectable } from 'inversify';
import { ApplicationDb } from '../../core/infrastructure/ApplicationDb';
import { Operator } from '../../core/infrastructure/Entities';
import { OperatorQueries } from '../../core/queries/OperatorQueries';
import { OperatorService } from '../../core/services/Operator/OperatorService';
import { OperatorSessionService } from '../../core/services/Operator/OperatorSessionService';
import { SynchronizationService } from '../../core/services/Synchronization/SynchronizationService';
import { IPaginatedResult } from '../../shared/types/IPaginatedResult';
import { IResult } from '../../shared/types/IResult';
import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { IOperator } from '../../shared/types/IOperator';

@IpcController()
@injectable()
export class OperatorController {
  constructor(
    @inject(ApplicationDb) private readonly _db: ApplicationDb,
    @inject(SynchronizationService) private readonly _syncService: SynchronizationService,
    @inject(OperatorService) private readonly _operatorService: OperatorService,
    @inject(OperatorSessionService) private readonly _operatorSessionService: OperatorSessionService,
  ) { }

  @IpcMain('getOperators')
  async getOperators(): Promise<IPaginatedResult<IOperator[]>> {
    const query = new OperatorQueries(this._db);
    return {
      data: await query.getOperators(),
      count: await query.countOperators()
    };
  }

  @IpcMain('getOperator')
  async getOperator(id: number): Promise<IResult<Operator>> {
    const query = new OperatorQueries(this._db);
    return { data: await query.getOperator(id) };
  }

  @IpcMain('syncOperators')
  async syncOperators(): Promise<IResult<boolean>> {
    return { data: await this._syncService.syncOperators() };
  }

  @IpcMain('operatorLogIn')
  async operatorLogIn(arg): Promise<IResult<boolean>> {
    return { data: await this._operatorSessionService.logIn(arg.id, arg.pinCode) };
  }

  @IpcMain('operatorLogOut')
  async operatorLogOut(): Promise<IResult<void>> {
    return { data: await this._operatorSessionService.logOut() };
  }

  @IpcMain('switchOperator')
  async swithOperator(): Promise<IResult<void>> {
    return { data: await this._operatorSessionService.switchOperator() };
  }

  @IpcMain('checkPrivilegeElevationPassword')
  async checkPrivilegeElevationPassword(data): Promise<IResult<boolean>> {
    return { data: await this._operatorService.checkPrivilegeElevationPassword(data.password, data.operatorId) };
  }

  @IpcMain('requestPrivelegeElevationByPassword')
  async requestPrivelegeElevationByPassword(password: string): Promise<IResult<boolean>> {
    return { data: await this._operatorService.requestPrivelegeElevationByPassword(password) };
  }

  @IpcMain('submitPrivilegeElevationPassword')
  async submitPrivilegeElevationPassword(password): Promise<IResult<void>> {
    return { data: await this._operatorService.submitPrivilegeElevationPassword(password) };
  }
}

