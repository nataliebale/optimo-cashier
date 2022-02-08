import { ICheckUpdate } from '../../shared/types/ICheckUpdate';
import { inject, injectable } from 'inversify';
import { UpdateService } from '../../core/services/Update/UpdateService';
import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { IResult } from '../../shared/types/IResult';
import { Constants } from '../../core/Constants';

@IpcController()
@injectable()
export class ApplicationController {
  constructor(
    @inject(UpdateService) private readonly _updateService: UpdateService
  ) { }

  @IpcMain('installUpdate')
  async installUpdate(): Promise<IResult<boolean>> {
    return { data: this._updateService.installUpdate() };
  }

  @IpcMain('checkUpdates')
  async checkUpdates(): Promise<IResult<ICheckUpdate>> {
    return { data: this._updateService.checkUpdates() };
  }

  @IpcMain('getAppVer')
  async getVersion(): Promise<IResult<string>> {
    return { data: Constants.AppVer };
  }
}
