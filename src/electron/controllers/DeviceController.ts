import { inject, injectable } from 'inversify';
import { DeviceService } from '../../core/services/Device/DeviceService';
import { HttpAdapter } from '../../core/services/Http/HttpAdapter';
import { SettingsService } from '../../core/services/Settings/SettingService';
import { ISetupConfig } from '../../shared/types/ISetupConfig';
import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { IResult } from '../../shared/types/IResult';
import { Environment } from '../../shared/enums/Environment';

@IpcController()
@injectable()
export class DeviceController {
  constructor(
    @inject(SettingsService) private readonly _settings: SettingsService,
    @inject(DeviceService) private readonly _deviceService: DeviceService,
    @inject(HttpAdapter) private readonly _httpAdapter: HttpAdapter
  ) {}

  @IpcMain('getDeviceId')
  async getDeviceId(): Promise<IResult<string>> {
    return { data: this._settings.data.deviceId };
  }

  @IpcMain('getDaisyExpertPort')
  async getDaisyExpertPort(): Promise<IResult<string>> {
    return { data: await this._deviceService.getCashierPort() };
  }

  @IpcMain('getEnv')
  async getEnv(): Promise<IResult<Environment>> {
    return { data: this._settings.data.env };
  }

  @IpcMain('isInited')
  async isInited(): Promise<IResult<boolean>> {
    return { data: this._settings.data.isInited };
  }

  @IpcMain('setEnv')
  async setEnv(data): Promise<IResult<boolean>> {
    await this._settings.setProperty((s) => {
      s.env = data;
    });
    return { data: true };
  }

  @IpcMain('reboot')
  async reboot(): Promise<IResult<any>> {
    return { data: await this._deviceService.reboot() };
  }

  @IpcMain('shutDown')
  async shutDown(): Promise<IResult<any>> {
    return { data: await this._deviceService.shutDown() };
  }

  @IpcMain('setConfig')
  async setConfig(config: ISetupConfig): Promise<IResult<boolean>> {
    await this._settings.setProperty((p) => {
      p.cashier = config.cashier;
      p.card = config.card;
    });
    return { data: true };
  }

  @IpcMain('closeDay')
  async closeDay(): Promise<IResult<any>> {
    return { data: await this._deviceService.closeDay() };
  }
}
