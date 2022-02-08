import { IpcController, IpcMain } from "../infrastructure/IpcDecorators";
import { injectable, inject } from "inversify";
import { SettingsService } from "../../core/services/Settings/SettingService";
import { IResult } from "../../shared/types/IResult";
import { ISettings } from "../../shared/types/ISettings";

@IpcController()
@injectable()
export class SettingsController {
  constructor(
    @inject(SettingsService) private readonly _settings: SettingsService
  ) { }

  @IpcMain('GetSettings')
  async getSettings(): Promise<IResult<ISettings>> {
    return { data: this._settings.data };
  }
}