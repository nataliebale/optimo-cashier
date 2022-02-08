import { inject, injectable } from 'inversify';
import { UserType } from '../../shared/enums/UserType';
import { IBOListRequest } from '../../shared/types/IBOListRequest';
import { ICredentials } from '../../shared/types/ICredentials';
import { ILegalEntityListModel } from '../../shared/types/ILegalEntityListModel';
import { ILocation } from '../../shared/types/ILocation';
import { ILoginDTO } from '../../shared/types/ILoginDTO';
import { IResult } from '../../shared/types/IResult';
import { ISetupConfig } from '../../shared/types/ISetupConfig';
import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { HttpAdapter } from './../../core/services/Http/HttpAdapter';
import { SettingsService } from './../../core/services/Settings/SettingService';

const atob = require('atob');

@IpcController()
@injectable()
export class SetupController {
  constructor(
    @inject(HttpAdapter) private readonly _httpAdapter: HttpAdapter,
    @inject(SettingsService) private readonly _settings: SettingsService
  ) {}

  @IpcMain('setupLogin')
  async login(data: ICredentials): Promise<IResult<ILoginDTO>> {
    if (this._settings.data.isInited) {
      throw new Error('Already inited');
    }

    await this._httpAdapter.checkInternetStatus();
    const login: ILoginDTO = await this._httpAdapter.post(
      this._httpAdapter.API_SIGN_IN,
      data,
      false
    );
    if (login) {
      await this._httpAdapter.setAuthorization(data.userName, data.password, data.legalEntityId);
    }

    if (login.userType != UserType.Admin && login.userType != UserType.Staff) {
      if (login.role != 'Admin' && login.role != 'BO') {
        return null;
      }
    }

    if (login.userType == UserType.Staff) {
      const tokenData = JSON.parse(atob(login.accessToken.split('.')[1]));
      login.productType = tokenData.ProductType;
    }

    return { data: login };
  }

  @IpcMain('setDeviceSerialNumber')
  async setDeviceSerialNumber(deviceSerialNumber): Promise<IResult<boolean>> {
    if (this._settings.data.isInited) {
      throw new Error('Already inited');
    }

    await this._settings.setProperty((p) => (p.deviceSerialNumber = deviceSerialNumber));

    return { data: true };
  }

  @IpcMain('setupGetBOList')
  async getBOList(data: IBOListRequest): Promise<IResult<ILegalEntityListModel[]>> {
    if (this._settings.data.isInited) {
      throw new Error('Already inited');
    }

    return {
      data: await this._httpAdapter.post(this._httpAdapter.API_GET_LEGAL_ENTITY_LIST, data, true),
    };
  }

  @IpcMain('setupGetLocations')
  async getLocations(id: string): Promise<IResult<ILocation[]>> {
    if (this._settings.data.isInited) {
      throw new Error('Already inited');
    }

    if (id) {
      return {
        data: JSON.parse(
          await this._httpAdapter.get(
            `${this._httpAdapter.API_LOCATIONS}?legalEntityId=${id}`,
            true
          )
        ),
      };
    } else {
      return {
        data: JSON.parse(await this._httpAdapter.get(this._httpAdapter.API_LOCATIONS, true)),
      };
    }
  }

  @IpcMain('setupSetConfig')
  async setConfig(config: ISetupConfig): Promise<void> {
    if (this._settings.data.isInited) {
      throw new Error('Already inited');
    }

    await this._httpAdapter.post(
      this._httpAdapter.API_REGISTER_DEVICE,
      {
        deviceId: this._settings.data.deviceId,
        password: this._settings.data.devicePassword,
        locationId: config.locationId,
        legalEntityId: config.legalEntityId ? config.legalEntityId : null,
        deviceSerialNumber: this._settings.data.deviceSerialNumber,
        productType: config.productType,
      },
      true
    );

    await this._settings.setProperty((p) => {
      p.cashier = config.cashier;
      p.card = config.card;
      p.bogConfiguration = config.bogConfiguration;
      p.receiptPrinter = config.receiptPrinter;
      p.printerSettings = config.printerSettings;
      p.isInited = true;
      p.hasCashBox = config.hasCashBox;
      p.isFullScreen = config.isFullScreen;
      p.syncIntervalSec = config.syncIntervalSec ?? p.syncIntervalSec;
      p.productType = config.productType;
    });
  }
}
