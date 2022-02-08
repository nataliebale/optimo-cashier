import { inject, injectable } from 'inversify';
import { DeviceService } from '../../core/services/Device/DeviceService';
import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { IResult } from '../../shared/types/IResult';
import { IWifiResponse } from '../../shared/types/IWifiResponse';
import { IWifiNetworksModel } from '../../shared/types/IWifiNetworksModel';
import { IWifiStatusModel } from '../../shared/types/IWifiStatusModel';

@IpcController()
@injectable()
export class WifiController {
  constructor(
    @inject(DeviceService) private readonly _deviceService: DeviceService
  ) { }

  @IpcMain('getWifiStatus')
  async getWifiStatus(): Promise<IResult<IWifiStatusModel>> {
    return { data: await this._deviceService.getWifiStatus() };
  }

  @IpcMain('getWifiNetworks')
  async getWifiNetworks(): Promise<IResult<IWifiNetworksModel>> {
    return { data: await this._deviceService.getWifiNetworks() };
  }

  @IpcMain('connectToWifi')
  async connectToWifi(data): Promise<IResult<IWifiResponse>> {
    return { data: await this._deviceService.connectToWifi(data) };
  }

  @IpcMain('disconnectWifi')
  async disconnectWifi(): Promise<IResult<IWifiResponse>> {
    return { data: await this._deviceService.disconnectWifi() };
  }
}
