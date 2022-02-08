import * as log from 'electron-log';
import { inject, injectable } from 'inversify';
import * as isOnline from 'is-online';
import * as request from 'request-promise-native';
import { CommonFunctions } from '../../../shared/CommonFunctions';
import { OdinEvent } from '../../../shared/enums/OdinEvent';
import { OfflineException } from '../../../shared/exceptions/OfflineException';
import { SettingsService } from '../Settings/SettingService';
import { SystemEventService } from '../SystemEvent/SystemEventService';
import { Environment } from '../../../shared/enums/Environment';
import { Constants } from '../../Constants';

const atob = require('atob');

@injectable()
export class HttpAdapter {
  private token?: string;
  private _deviceId: string;
  private _devicePassword: string;

  public isOnline = false;
  public legalEntityId: string;
  public tokenExpiration: Date = new Date(0);

  get deviceId() {
    return this._deviceId || this._settings.data.deviceId;
  }

  set deviceId(value: string) {
    this._deviceId = value;
  }

  private get devicePassword(): string {
    return this._devicePassword || this._settings.data.devicePassword;
  }

  private _IDENTITY_PATH: string;
  private _CORE_PATH: string;
  private _POS_PATH: string;

  public API_REGISTER_DEVICE: string;
  public API_SIGN_IN: string;
  public API_SIGN_IN_WITH_TOKEN: string;
  public API_CHECK_AUTH: string;
  public API_GET_LEGAL_ENTITY_LIST: string;
  public API_ENTITY_CLIENTS: string;
  public API_STOCK_ITEMS: string;
  public API_SALE: string;
  public API_RETURN_SALE: string;
  public API_USER_DETAILS: string;
  public API_OPERATORS: string;
  public API_OPERATOR_LOGIN: string;
  public API_OPERATOR_LOGOUT: string;
  public API_CATEGORIES: string;
  public API_POPULAR_PRODUCTS: string;
  public API_SUPPLIERS: string;
  public API_SUPPLIRE_STOCK_ITEMS: string;
  public API_IMEIS: string;
  public API_PURCHASE_ORDERS: string;
  public API_RECEIVE_ORDER: string;
  public API_SHIFT: string;
  public API_SHIFT_START: string;
  public API_SHIFT_END: string;
  public API_ENTITY_SALE: string;
  public API_LOCATIONS: string;
  public API_CASH_WITHDRAWAL: string;
  public API_SPACES: string;
  public API_TIME: string;

  constructor(
    @inject(SettingsService) private readonly _settings: SettingsService,
    @inject(SystemEventService) private readonly _eventService: SystemEventService
  ) {}

  async checkInternetStatus() {
    const online = await isOnline();

    if (this.isOnline != online) {
      this.isOnline = online;
      log.info(`ინტერნეტი აქტირუია: ${this.isOnline}`);
      this._eventService.sendEvent(OdinEvent.INTERNET_STATUS_CHANGED, this.isOnline);
    }

    return this.isOnline;
  }

  async get(url: string, requireAuth: boolean) {
    if (!url) {
      throw new Error('NO URL');
    }
    return await this.functionWrapper(async (headers) => {
      return await request.get(url, { headers: headers });
    }, requireAuth);
  }

  async post(url: string, data: any, requireAuth: boolean) {
    if (!url) {
      throw new Error('NO URL');
    }
    return await this.functionWrapper(async (headers) => {
      return await request.post(url, { headers: headers, json: data });
    }, requireAuth);
  }

  async put(url: string, data: any, requireAuth: boolean) {
    if (!url) {
      throw new Error('NO URL');
    }
    return await this.functionWrapper(async (headers) => {
      return await request.put(url, { headers: headers, json: data });
    }, requireAuth);
  }

  async delete(url: string, data: any, requireAuth: boolean) {
    if (!url) {
      throw new Error('NO URL');
    }
    return await this.functionWrapper(async (headers) => {
      return await request.delete(url, { headers: headers, json: data });
    }, requireAuth);
  }

  async setAuthorization(userName: string, password: string, legalEntityId?: string) {
    const result = await this.post(
      this.API_SIGN_IN,
      {
        userName: userName,
        password: password,
        legalEntityId: legalEntityId,
      },
      false
    );

    if (!result) {
      return false;
    }

    this._deviceId = userName;
    this._devicePassword = password;
    this.legalEntityId = legalEntityId;

    this.token = result.accessToken;
    this.tokenExpiration = new Date(result.expires * 1000);
    const tokenData = JSON.parse(atob(this.token.split('.')[1]));
    await this._settings.setProperty((x) => {
      x.uid = tokenData.uid;
      x.productType = tokenData.ProductType;
      x.locationId = tokenData.LocationId;
    });

    return true;
  }

  private async functionWrapper(func: Function, requireAuth: boolean) {
    if (!this.isOnline) {
      throw new OfflineException();
    }

    const headers = {
      Accept: 'application/json',
      'x-request-id': CommonFunctions.generateGuid(),
      'User-Agent': Constants.UserAgent,
    };

    if (requireAuth) {
      await this.checkAuth();
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      return await func(headers);
    } catch (err) {
      log.warn('სერვერთან კავშირის შეცდომა', headers, err);
      throw err.error;
    }
  }

  public async Init() {
    switch (this._settings.data.env) {
      case Environment.Development: {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        this._IDENTITY_PATH = 'https://identity.dev.optimo.ge/';
        this._CORE_PATH = 'https://core.dev.optimo.ge/api/';
        this._POS_PATH = 'https://pos.dev.optimo.ge/api/';
        //this._POS_PATH = 'https://localhost:5001/api/';
        break;
      }
      case Environment.Staging: {
        this._IDENTITY_PATH = 'https://identity.staging.optimo.ge/';
        this._CORE_PATH = 'https://core.staging.optimo.ge/api/';
        this._POS_PATH = 'https://pos.staging.optimo.ge/api/';
        break;
      }
      case Environment.Production: {
        this._IDENTITY_PATH = 'https://identity.optimo.ge/';
        this._CORE_PATH = 'https://core.optimo.ge/api/';
        this._POS_PATH = 'https://pos.optimo.ge/api/';
        break;
      }
    }

    this.API_REGISTER_DEVICE = `${this._IDENTITY_PATH}V1/User/RegisterDevice`;
    this.API_SIGN_IN = `${this._IDENTITY_PATH}V1/User/SingIn`;
    this.API_SIGN_IN_WITH_TOKEN = `${this._IDENTITY_PATH}V1/User/SingInWithToken`;
    this.API_CHECK_AUTH = `${this._IDENTITY_PATH}V1/User/CheckAuth`;
    this.API_GET_LEGAL_ENTITY_LIST = `${this._IDENTITY_PATH}V1/User/GetLegalEntities`;
    this.API_ENTITY_CLIENTS = `${this._CORE_PATH}V1/pos/entityclients`;
    this.API_SALE = `${this._POS_PATH}V1/pos/sale`;
    this.API_RETURN_SALE = `${this._POS_PATH}V1/pos/return-sale`;
    this.API_ENTITY_SALE = `${this._POS_PATH}V1/pos/entitysale`;
    this.API_STOCK_ITEMS = `${this._CORE_PATH}V1/pos/stockitems`;
    this.API_USER_DETAILS = `${this._IDENTITY_PATH}V1/User/GetUserDetails`;
    this.API_OPERATORS = `${this._CORE_PATH}V1/pos/operators`;
    this.API_OPERATOR_LOGIN = `${this._CORE_PATH}V1/pos/operators/Login`;
    this.API_OPERATOR_LOGOUT = `${this._CORE_PATH}V1/pos/operators/Logout`;
    this.API_CATEGORIES = `${this._CORE_PATH}V1/pos/stockitemcategories`;
    this.API_POPULAR_PRODUCTS = `${this._CORE_PATH}V1/pos/stockitems/popular`;
    this.API_SUPPLIERS = `${this._CORE_PATH}V1/pos/suppliers`;
    this.API_SUPPLIRE_STOCK_ITEMS = `${this._CORE_PATH}V1/pos/supplierstockitems`;
    this.API_IMEIS = `${this._CORE_PATH}V1/pos/imeis`;
    this.API_PURCHASE_ORDERS = `${this._CORE_PATH}V1/pos/purchaseorders`;
    this.API_RECEIVE_ORDER = `${this._CORE_PATH}V1/purchaseorders/receive`;
    this.API_SHIFT = `${this._CORE_PATH}V1/pos/operators/shifts`;
    this.API_SHIFT_START = `${this._CORE_PATH}V1/pos/operators/shifts/start`;
    this.API_SHIFT_END = `${this._CORE_PATH}V1/pos/operators/shifts/end`;
    this.API_CASH_WITHDRAWAL = `${this._CORE_PATH}V1/pos/operators/shifts/WithdrawCash`;
    this.API_LOCATIONS = `${this._CORE_PATH}V1/pos/locations`;
    this.API_SPACES = `${this._CORE_PATH}V1/pos/spaces`;
    this.API_TIME = `${this._CORE_PATH}V1/pos/utctime`;

    await this.checkInternetStatus();
  }

  private async checkAuth() {
    if (this.tokenExpiration.getTime() - new Date().getTime() < 30000) {
      await this.setAuthorization(this.deviceId, this.devicePassword, this.legalEntityId);
    }
  }
}
