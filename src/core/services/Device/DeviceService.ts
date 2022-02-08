import { IReverseCardTransaction } from './../../../shared/types/IReverseCardTransaction';
import { PipeService } from './../Pipe/PipeService';
import { IConnectToWifi } from './../../../shared/types/IConnectToWifi';
import log from 'electron-log';
import { inject, injectable } from 'inversify';
import { CommonFunctions } from '../../../shared/CommonFunctions';
import { OdinEvent } from '../../../shared/enums/OdinEvent';
import { IBaseOrder } from '../../../shared/types/IBaseOrder';
import { ISettings } from '../../../shared/types/ISettings';
import { default as WiFiControl } from '../../infrastructure/Modules/wifi-control/wifi-control';
import { SettingsService } from '../Settings/SettingService';
import { SystemEventService } from '../SystemEvent/SystemEventService';
import { IWifiResponse } from '../../../shared/types/IWifiResponse';
import { IWifiStatusModel } from '../../../shared/types/IWifiStatusModel';
import { IWifiNetworksModel } from '../../../shared/types/IWifiNetworksModel';
import { IOrderResponse } from '../../../shared/types/IOrderResponse';

@injectable()
export class DeviceService {
  public Executing: any = false;

  constructor(
    @inject(SettingsService) private readonly _settings: SettingsService,
    @inject(SystemEventService) private readonly _eventService: SystemEventService,
    @inject(PipeService) private readonly _pipeService: PipeService
  ) {}

  async Run() {
    this._eventService.sendEvent(OdinEvent.BOOT, 'მოწყობილობების შემოწმება');

    try {
      await this._pipeService.init();
    } catch (e) {
      console.error(e);
    }

    WiFiControl.init({
      debug: true,
    });

    await this.initDll(this._settings.data);

    if (this._settings.data.cashier) {
      await this._settings.setProperty(async (p) => (p.cashierPort = await this.getCashierPort()));
    }
  }

  async getWifiStatus(): Promise<IWifiStatusModel> {
    return WiFiControl.getIfaceState();
  }

  async getWifiNetworks(): Promise<IWifiNetworksModel> {
    return await new Promise((resolve, reject) => {
      WiFiControl.scanForWiFi(function (err, response) {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  async connectToWifi(data: IConnectToWifi): Promise<IWifiResponse> {
    return await new Promise((resolve, reject) => {
      WiFiControl.connectToAP(data, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  async disconnectWifi(): Promise<IWifiResponse> {
    return await new Promise((resolve, reject) => {
      WiFiControl.resetWiFi((err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  async order(order: IBaseOrder): Promise<IOrderResponse> {
    await this.whenReady();

    return await this.listener<IOrderResponse>(order, this.order.name, (err) => {
      log.warn('გაყიდვის ბრძანება წარუმატებელია', err);
    });
  }

  async reverseCardTransaction(order: IReverseCardTransaction): Promise<IOrderResponse> {
    await this.whenReady();

    return await this.listener<IOrderResponse>(order, this.reverseCardTransaction.name, (err) => {
      log.warn('გაყიდვის ბრძანება წარუმატებელია', err);
    });
  }

  async preOrder(order: IBaseOrder): Promise<IOrderResponse> {
    await this.whenReady();

    return await this.listener<IOrderResponse>(order, this.preOrder.name, (err) => {
      log.warn('პრეჩეკის ბრძანება წარუმატებელია', err);
    });
  }

  async getCashierPort(): Promise<string> {
    await this.whenReady();
    return await this.listener<string>(null, this.getCashierPort.name);
  }

  async closeDay(): Promise<void> {
    await this.whenReady();

    return await this.listener<void>(null, this.closeDay.name, null, async () => {
      await this._settings.setProperty((p) => (p.dayCloseDate = new Date()));
    });
  }

  async shutDown(): Promise<void> {
    await this.whenReady();
    return await this.listener<void>(null, this.shutDown.name);
  }

  async reboot(): Promise<void> {
    await this.whenReady();
    return await this.listener<void>(null, this.reboot.name);
  }

  async initDll(settings: ISettings): Promise<string> {
    await this.whenReady();
    return await this.listener<string>(settings, this.initDll.name);
  }

  private async whenReady(): Promise<void> {
    while (this.Executing) {
      log.warn('edge running, sleeping...', this.Executing);
      await CommonFunctions.sleep(500);
    }
  }

  private async listener<T>(
    payload: object,
    methodName: string,
    onReject: Function = null,
    onResolve: Function = null
  ) {
    methodName = `${methodName.charAt(0).toUpperCase()}${methodName.slice(1)}`;
    return new Promise<T>(async (resolve, reject) => {
      this.Executing = methodName;
      const requestId = CommonFunctions.generateGuid();
      this._pipeService.once(`Callback${requestId}`, async (response) => {
        this.Executing = null;
        if (response.Error) {
          if (onReject) {
            await onReject(response.Error);
          }
          reject(response.Error);
        } else {
          if (onResolve) {
            await onResolve(response.Data);
          }
          resolve(response.Data);
        }
      });
      try {
        await this._pipeService.send(methodName, requestId, payload);
      } catch (e) {
        this.Executing = null;
        if (e.code) {
          await this._pipeService.init();
          await this.initDll(this._settings.data);
          this.Executing = methodName;
          try {
            await this._pipeService.send(methodName, requestId, payload);
          } catch (e) {
            this.Executing = null;
            reject(e);
          }
        } else {
          reject(e);
        }
      }
    });
  }
}
