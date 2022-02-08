import { inject, injectable } from 'inversify';
import { SettingsService } from '../../core/services/Settings/SettingService';
import { SynchronizationService } from '../../core/services/Synchronization/SynchronizationService';
import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { IResult } from '../../shared/types/IResult';

@IpcController()
@injectable()
export class SynchronizationController {
  constructor(
    @inject(SynchronizationService) private readonly _syncService: SynchronizationService,
    @inject(SettingsService) private readonly _settings: SettingsService,
  ) { }

  @IpcMain('sync')
  async sync(): Promise<IResult<boolean>> {
    return { data: await this._syncService.sync() };
  }

  @IpcMain('getLastSyncDate')
  async getLastSyncDate(): Promise<IResult<Date>> {
    return { data: this._settings.data.syncDate };
  }
}
