import { IFinishReturnOrderRequest } from './../../../../../shared/types/IFinishReturnOrderRequest';
import { IReturnOrderRequest } from './../../../../../shared/types/IReturnOrderRequest';
import { ICreateReturnOrderRequest } from '../../../../../shared/types/ICreateReturnOrderRequest';
import { IClockDriftStatus } from './../../../../../shared/types/IClockDriftStatus';
import { ILogger } from './MainProcessAPI.d';
import { IOrderResponse } from '../../../../../shared/types/IOrderResponse';
import { ISetupConfig } from '../../../../../shared/types/ISetupConfig';
import { CommonFunctions } from '../../../../../shared/CommonFunctions';
import { OdinIPC, OdinIPCResult } from '../../../../../shared/enums/OdinIPC';
import { Injectable, NgZone } from '@angular/core';
import { IPaginatedResult } from '../../../../../shared/types/IPaginatedResult';
import { ISupplier } from '../../../../../shared/types/ISupplier';
import { IConnectToWifi } from '../../../../../shared/types/IConnectToWifi';
import { IWifiNetworksModel } from '../../../../../shared/types/IWifiNetworksModel';
import { IStockItemCategory } from '../../../../../shared/types/IStockItemCategory';
import { IWifiResponse } from '../../../../../shared/types/IWifiResponse';
import { IWifiStatusModel } from '../../../../../shared/types/IWifiStatusModel';
import { IResult } from '../../../../../shared/types/IResult';
import { IStockItem } from '../../../../../shared/types/IStockItem';
import { IOperator } from '../../../../../shared/types/IOperator';
import { IPurchaseOrder } from '../../../../../shared/types/IPurchaseOrder';
import { OdinEvent } from '../../../../../shared/enums/OdinEvent';
import { ICheckUpdate } from '../../../../../shared/types/ICheckUpdate';
import { IReceivedPurchaseOrder } from '../../../../../shared/types/IReceivedPurchaseOrder';
import { ICredentials } from '../../../../../shared/types/ICredentials';
import { IShift } from '../../../../../shared/types/IShift';
import { Environment } from '../../../../../shared/enums/Environment';
import { IIMEI } from '../../../../../shared/types/IIMEI';
import { IEntityOrder, EntityPaymentType } from '../../../../../shared/types/IEntityOrder';
import { Observable, from, bindCallback } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ISettings } from '../../../../../shared/types/ISettings';
import { ICashWithdrawal } from '../../../../../shared/types/ICashWithdrawal';
import { IOrder, PaymentType } from '../../../../../shared/types/IOrder';
import { ICheck } from '../../../../../shared/types/ICheck';
import { ICheckItem } from '../../../../../shared/types/ICheckItem';
import { IEntityOrderDetails } from '../../../../../shared/types/IEntityOrderDetails';
import { ICreateCheckRequest } from '../../../../../shared/types/ICreateCheckRequest';
import { ITableWithStatus } from '../../../../../shared/types/ITableWithStatus';
import { OptimoProductType } from '../../../../../shared/enums/OptimoProductType';
import { IShiftTotalSales } from '../../../../../shared/types/IShiftTotalSale';
import { MainProcessAPI } from './MainProcessAPI';
import { IRemoveCheckRequest } from '../../../../../shared/types/IRemoveCheckItemRequest';
import { ISpaceWithActiveChecks } from '../../../../../shared/types/ISpaceWithActiveChecks';
import { ITransactionListItem } from '../../../../../shared/types/ITransactionList';
import {
  ITransactionHistoryFilter,
  ITransactionHistoryFilterWithSearch,
} from '../../../../../shared/types/ITransactionHistoryFilter';
import { ITransactionDetails } from '../../../../../shared/types/ITransactionDetails';
import { IEntityClient } from '../../../../../shared/types/IEntityClient';
import { ICreateReturnOrderResult } from '../../../../../shared/types/ICreateReturnOrderResult';
import { IReturnOrderResponse } from '../../../../../shared/types/IReturnOrderResponse';

@Injectable({
  providedIn: 'root',
})
export class MainProcessService {
  public get mainPageUrl(): string {
    let url = '/dashboard';
    switch (this.settings.productType) {
      case OptimoProductType.HORECA:
        url = '/space';
        break;
      case OptimoProductType.Retail:
        url = '/dashboard';
        break;

      default:
        break;
    }
    return url;
  }

  settings: ISettings;
  logger: ILogger;

  private ipcRenderer: MainProcessAPI;
  private callerId: string;

  constructor(private zone: NgZone) {
    this.ipcRenderer = window.MainProcessAPI;
    this.logger = this.ipcRenderer.logger;
    // this.remote = electron.remote;
    this.callerId = CommonFunctions.generateGuid();
    this.ipcRenderer.send(OdinEvent.SUBSCRIBE, this.callerId);

    // todo
    this.once('GetSettings.result' as any, (data: IResult<ISettings>) => {
      this.settings = data.data;
    });
    this.ipcRenderer.send('GetSettings', this.callerId, {});
  }

  on(event: OdinEvent, callback: Function) {
    this.ipcRenderer.on(`${event}/${this.callerId}`, (_, data) => {
      callback(data);
    });
  }

  once(event: OdinEvent, callback: Function) {
    this.ipcRenderer.once(`${event}/${this.callerId}`, (_, data) => {
      callback(data);
    });
  }

  listen(event: OdinEvent) {
    return bindCallback(this.ipcRenderer.on).call(this.ipcRenderer, `${event}/${this.callerId}`);
  }

  listenEvents(event, callback) {
    this.ipcRenderer.on(event, callback);
  }

  getSettings() {
    return new Observable<IResult<ISettings>>((subscriber) => {
      this.ipcRenderer.once(
        `GetSettings.result/${this.callerId}`,
        (_, result: IResult<ISettings>) => {
          this.zone.run(() => {
            subscriber.next(result);
            subscriber.complete();
          });
        }
      );
      this.ipcRenderer.send('GetSettings', this.callerId);
    });
  }

  getSuppliers(
    pageIndex: number,
    pageSize: number,
    name?: string
  ): Observable<IPaginatedResult<ISupplier[]>> {
    return this.ipcSend<IPaginatedResult<ISupplier[]>>(OdinIPC.GET_SUPPLIERS, {
      pageIndex,
      pageSize,
      name,
    });
  }

  getCategories(
    pageIndex: number,
    pageSize: number,
    name?: string,
    parentId?: number,
    all = false
  ): Observable<IPaginatedResult<IStockItemCategory[]>> {
    return this.ipcSend<IPaginatedResult<IStockItemCategory[]>>(OdinIPC.GET_CATEGORIES, {
      pageIndex,
      pageSize,
      name,
      all,
      parentId,
    });
  }

  syncOperators(): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.SYNC_OPERATORS);
  }

  getProductByBarcode(barcode: string): Observable<IResult<IStockItem[]>> {
    return this.ipcSend<IResult<IStockItem[]>>(OdinIPC.GET_PRODUCT_BY_BARCODE, barcode);
  }

  getIMEISByStockItem(id: number): Observable<IResult<IIMEI[]>> {
    return this.ipcSend<IResult<IIMEI[]>>(OdinIPC.GET_IMEIS_BY_STOCK_ITEM, id);
  }

  getOperators(): Observable<IPaginatedResult<IOperator[]>> {
    return this.ipcSend<IPaginatedResult<IOperator[]>>(OdinIPC.GET_OPERATORS).pipe(
      tap((data) => {
        console.log('getOperators', data);
      })
    );
  }

  getOperator(id: number): Observable<IResult<IOperator>> {
    return this.ipcSend<IResult<IOperator>>(OdinIPC.GET_OPERATOR, id).pipe(
      tap((data) => {
        console.log('getOperator', data);
      })
    );
  }

  operatorLogIn(id: number, pinCode: string): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.OPERATOR_LOGIN, {
      id,
      pinCode,
    });
  }

  operatorLogOut(): Observable<IResult<void>> {
    return this.ipcSend<IResult<void>>(OdinIPC.OPERATOR_LOGOUT);
  }

  switchOperator(): Observable<IResult<void>> {
    return this.ipcSend<IResult<void>>(OdinIPC.SWITCH_OPERATOR);
  }

  getProducts(
    keyWord: string,
    pageIndex: number,
    pageSize: number,
    category?: number,
    topSold = false,
    supplier?: number,
    forDashboard?: boolean
  ): Observable<IPaginatedResult<IStockItem[]>> {
    return this.ipcSend<IPaginatedResult<IStockItem[]>>(OdinIPC.GET_PRODUCTS, {
      keyWord,
      pageIndex,
      pageSize,
      category,
      topSold,
      supplier,
      forDashboard,
    });
  }

  getPurchaseOrders(
    keyWord: string,
    pageIndex: number,
    pageSize: number,
    purchaseOrderId?: number
  ): Observable<IPaginatedResult<IPurchaseOrder[]>> {
    return this.ipcSend<IPaginatedResult<IPurchaseOrder[]>>(OdinIPC.GET_PURCHASE_ORDERS, {
      keyWord,
      pageIndex,
      pageSize,
      purchaseOrderId,
    });
  }

  closeDay(): Observable<IResult<void>> {
    return this.ipcSend<IResult<void>>(OdinIPC.CLOSE_DAY);
  }

  getDaisyExpertPort(): Observable<IResult<string>> {
    return this.ipcSend<IResult<string>>(OdinIPC.GET_DAISY_EXPERT_PORT);
  }

  createReturnOrder(
    order: ICreateReturnOrderRequest
  ): Observable<IResult<ICreateReturnOrderResult>> {
    return this.ipcSend<IResult<ICreateReturnOrderResult>>(OdinIPC.CREATE_RETURN_ORDER, order);
  }

  returnOrder(order: IReturnOrderRequest): Observable<IResult<IReturnOrderResponse>> {
    return this.ipcSend<IResult<IReturnOrderResponse>>(OdinIPC.RETURN_ORDER, order);
  }

  finishReturnOrder(order: IFinishReturnOrderRequest) {
    return this.ipcSend<IResult<IOrderResponse>>(OdinIPC.FINISH_RETURN_ORDER, order);
  }

  cancelReturnOrder(order: IFinishReturnOrderRequest) {
    return this.ipcSend<IResult<IOrderResponse>>(OdinIPC.CANCEL_RETURN_ORDER, order);
  }

  order(order: IOrder): Observable<IResult<IOrderResponse>> {
    return this.ipcSend<IResult<IOrderResponse>>(OdinIPC.ORDER, order);
  }

  preOrder(order: IOrder): Observable<IResult<IOrderResponse>> {
    return this.ipcSend<IResult<IOrderResponse>>(OdinIPC.PRE_ORDER, order);
  }

  getWifiStatus(): Observable<IResult<IWifiStatusModel>> {
    return this.ipcSend<IResult<IWifiStatusModel>>(OdinIPC.GET_WIFI_STATUS);
  }

  getWifiNetworks(): Observable<IResult<IWifiNetworksModel>> {
    return this.ipcSend<IResult<IWifiNetworksModel>>(OdinIPC.GET_WIFI_NETWORKS);
  }

  connectToWifi(ap: IConnectToWifi): Observable<IResult<IWifiResponse>> {
    return this.ipcSend<IResult<IWifiResponse>>(OdinIPC.CONNECT_TO_WIFI, ap);
  }

  disconnectWifi(): Observable<IResult<IWifiResponse>> {
    return this.ipcSend<IResult<IWifiResponse>>(OdinIPC.DISCONNECT_WIFI);
  }

  getEnv(): Observable<IResult<Environment>> {
    return this.ipcSend<IResult<Environment>>(OdinIPC.GET_ENV);
  }

  isInited(): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.IS_INITED);
  }

  setEnv(env: Environment): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.SET_ENV, env);
  }

  registerDevice(user: string, password: string, uid: string): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.REGISTER_DEVICE, {
      user,
      password,
      uid,
    });
  }

  checkUpdates(): Observable<IResult<ICheckUpdate>> {
    return this.ipcSend<IResult<ICheckUpdate>>(OdinIPC.CHECK_UPDATES);
  }

  installUpdate(): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.INSTALL_UPDATE);
  }

  reboot(): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.REBOOT);
  }

  shutDown(): Observable<IResult<void>> {
    return this.ipcSend<IResult<void>>(OdinIPC.SHUT_DOWN);
  }

  sync(): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.SYNC);
  }

  getDeviceId(): Observable<IResult<string>> {
    return this.ipcSend<IResult<string>>(OdinIPC.GET_DEVICE_ID);
  }

  getLastSyncDate(): Observable<IResult<Date>> {
    return this.ipcSend<IResult<Date>>(OdinIPC.GET_LAST_SYNC_DATE).pipe(
      map((result) => ({ ...result, data: new Date(result.data) }))
    );
  }

  getAppVer(): Observable<IResult<string>> {
    return this.ipcSend<IResult<string>>(OdinIPC.GET_APP_VER);
  }

  receiveOrder(order: IReceivedPurchaseOrder): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.RECEIVE_ORDER, order);
  }

  checkAdminCredentials(credentials: ICredentials): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.CHECK_ADMIN_CREDENTIALS, credentials);
  }

  close() {
    window.MainProcessAPI.close();
  }

  relaunch() {
    window.MainProcessAPI.relaunch();
  }

  startShift(cashBegin: number): Observable<IResult<IShift>> {
    return this.ipcSend<IResult<IShift>>(OdinIPC.START_SHIFT, cashBegin);
  }

  finishShift(cashEnd: number): Observable<IResult<void>> {
    // this.getShiftTotalSale().subscribe((data) => {
    //   console.log('დღიური გაყიდვები: ', data);
    // });

    return this.ipcSend<IResult<void>>(OdinIPC.FINISH_SHIFT, cashEnd);
  }

  getShift(): Observable<IResult<IShift>> {
    return this.ipcSend<IResult<IShift>>(OdinIPC.GET_SHIFT).pipe(
      tap((data) => {
        console.log('getShift', data);
      })
    );
  }

  setDeviceSerialNumber(deviceSerialNumber: string): Observable<IResult<void>> {
    return this.ipcSend<IResult<void>>(OdinIPC.SET_DEVICE_SN, deviceSerialNumber);
  }

  setConfig(config: ISetupConfig): Observable<IResult<void>> {
    console.log(config);
    return this.ipcSend<IResult<void>>(OdinIPC.SET_CONFIG, config);
  }

  getAllEntityClients(): Observable<IResult<IEntityClient[]>> {
    return this.ipcSend<IResult<IEntityClient[]>>(OdinIPC.ALL_ENTITY_CLIENTS);
  }

  getEntityClients(
    keyWord: string,
    pageIndex: number,
    pageSize: number
  ): Observable<IPaginatedResult<IEntityClient[]>> {
    return this.ipcSend<IPaginatedResult<IEntityClient[]>>(OdinIPC.ENTITY_CLIENTS, {
      keyWord,
      pageIndex,
      pageSize,
    });
  }

  entityOrder(order: IEntityOrder): Observable<IResult<IOrderResponse>> {
    return this.ipcSend<IResult<IOrderResponse>>(OdinIPC.ENTITY_ORDER, order);
  }

  submitPrivilegeElevationPassword(password: string): Observable<IResult<void>> {
    return this.ipcSend<IResult<void>>(OdinIPC.SUBMIT_PRIVILEGE_ELEVATION_PASSWORD, password);
  }

  withdrawCash(data: ICashWithdrawal): Observable<IResult<void>> {
    return this.ipcSend<IResult<void>>(OdinIPC.WITHDRAW_CASH, data);
  }

  getShiftTotalSale(): Observable<IResult<IShiftTotalSales>> {
    return this.ipcSend<IResult<IShiftTotalSales>>(OdinIPC.GET_SHIFT_TOTAL_SALES);
  }

  getTransactionHistoryList(
    filter: ITransactionHistoryFilterWithSearch,
    entity: boolean
  ): Observable<IResult<ITransactionListItem[]>> {
    return this.ipcSend<IResult<ITransactionListItem[]>>(OdinIPC.GET_TRANSACTION_HISTORY_LIST, {
      filter,
      entity,
    });
  }

  getTransactionDetails(
    transactionId: number,
    entity: boolean
  ): Observable<IResult<ITransactionDetails>> {
    return this.ipcSend<IResult<any>>(OdinIPC.GET_TRANSACTION_DETAILS, { transactionId, entity });
  }

  /**
   * ```typescript
   * { err: { name: PrivilegePasswordUsedException | WrongPrivilegePasswordException } }
   * ```
   */
  checkPrivilegeElevationPassword(
    password: string,
    operatorId: number
  ): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.CHECK_PRIVILEGE_ELEVATION_PASSWORD, {
      password,
      operatorId,
    });
  }

  /**
   * ```typescript
   * { err: { name: PrivilegePasswordUsedException | WrongPrivilegePasswordException } }
   * ```
   */
  requestPrivelegeElevationByPassword(password: string): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(
      OdinIPC.REQUEST_PRIVILEGE_ELEVATION_BY_PASSWORD,
      password
    );
  }

  checkSetTable(tableId: number): Observable<IResult<ICheck>> {
    return this.ipcSend<IResult<ICheck>>(OdinIPC.CHECK_SET_TABLE, tableId);
  }

  checkSetOperator(operatorId: number): Observable<IResult<ICheck>> {
    return this.ipcSend<IResult<ICheck>>(OdinIPC.CHECK_SET_OPERATOR, operatorId);
  }

  checkOrder(paymentType: PaymentType): Observable<IResult<IOrderResponse>> {
    return this.ipcSend<IResult<IOrderResponse>>(OdinIPC.CHECK_ORDER, paymentType);
  }

  checkEntityOrder(paymentType: EntityPaymentType): Observable<IResult<IOrderResponse>> {
    return this.ipcSend<IResult<IOrderResponse>>(OdinIPC.CHECK_ENTITY_ORDER, paymentType);
  }

  checkPreOrder(): Observable<IResult<IOrderResponse>> {
    return this.ipcSend<IResult<IOrderResponse>>(OdinIPC.CHECK_PREORDER);
  }

  checkSetTaxRate(taxRate: number): Observable<IResult<ICheck>> {
    return this.ipcSend<IResult<ICheck>>(OdinIPC.CHECK_SET_TAX_RATE, taxRate);
  }

  checkSetActive(checkId: number): Observable<IResult<ICheck>> {
    return this.ipcSend<IResult<ICheck>>(OdinIPC.CHECK_SET_ACTIVE, checkId);
  }

  checkCreate(data: ICreateCheckRequest): Observable<IResult<ICheck>> {
    return this.ipcSend<IResult<ICheck>>(OdinIPC.CHECK_CREATE, data);
  }

  checkGetActive(): Observable<IResult<ICheck>> {
    return this.ipcSend<IResult<ICheck>>(OdinIPC.CHECK_GET_ACTIVE);
  }

  checks(tableId?: number): Observable<IResult<ICheck[]>> {
    return this.ipcSend<IResult<ICheck[]>>(OdinIPC.CHECK_GET_CHECKS, tableId);
  }

  hasActiveChecks(operatorId?: number): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.CHECK_HAS_ACTIVE_CHECKS, operatorId);
  }

  checkUnsetActive(): Observable<IResult<void>> {
    return this.ipcSend<IResult<void>>(OdinIPC.CHECK_UNSET_ACTIVE);
  }

  checkAddItem(item: ICheckItem): Observable<IResult<ICheck>> {
    return this.ipcSend<IResult<ICheck>>(OdinIPC.CHECK_ADD_ITEM, item);
  }

  checkRemoveItem(item: IRemoveCheckRequest): Observable<IResult<ICheck>> {
    return this.ipcSend<IResult<ICheck>>(OdinIPC.CHECK_REMOVE_ITEM, item);
  }

  checkRemoveAllItems(): Observable<IResult<ICheck>> {
    return this.ipcSend<IResult<ICheck>>(OdinIPC.CHECK_REMOVE_ALL_ITEMS);
  }

  checkUpdateItem(item: ICheckItem): Observable<IResult<ICheck>> {
    return this.ipcSend<IResult<ICheck>>(OdinIPC.CHECK_UPDATE_ITEM, item);
  }

  checkDeleteCheck(checkId: number): Observable<IResult<void>> {
    return this.ipcSend<IResult<void>>(OdinIPC.CHECK_DELETE, checkId);
  }

  checkSetLegalEntityData(data: IEntityOrderDetails): Observable<IResult<ICheck>> {
    return this.ipcSend<IResult<ICheck>>(OdinIPC.CHECK_SET_ENTITY_DATA, data);
  }

  checkUnsetLegalEntityData(): Observable<IResult<ICheck>> {
    return this.ipcSend<IResult<ICheck>>(OdinIPC.CHECK_UNSET_ENTITY_DATA);
  }

  checkOperatorHasChecks(operatorId?: number): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.CHECK_OPERATOR_HAS_CHECKS, operatorId);
  }

  checkUpdateGuesGuestCount(guestCount: number): Observable<IResult<ICheck>> {
    return this.ipcSend<IResult<ICheck>>(OdinIPC.CHECK_UPDATE_GUEST_COUNT, guestCount);
  }

  getSpaces(): Observable<IResult<ISpaceWithActiveChecks[]>> {
    return this.ipcSend<IResult<ISpaceWithActiveChecks[]>>(OdinIPC.GET_SPACES);
  }

  getTablesWithStatus(spaceId: number): Observable<IResult<ITableWithStatus[]>> {
    return this.ipcSend<IResult<ITableWithStatus[]>>(OdinIPC.GET_TABLES_WITH_STATUS, spaceId);
  }

  clockCheckDriftStatus(): Observable<IResult<IClockDriftStatus>> {
    return this.ipcSend<IResult<IClockDriftStatus>>(OdinIPC.CLOCK_CHECK_DRIFT_STATUS);
  }

  clockWarningShown(timeShown: Date): Observable<IResult<boolean>> {
    return this.ipcSend<IResult<boolean>>(OdinIPC.CLOCK_WARNING_SHOWN, { timeShown });
  }

  private ipcSend<T extends IResult<any>>(event: OdinIPC, payload?): Observable<T> {
    return new Observable((subscriber) => {
      this.ipcRenderer.once(`${OdinIPCResult(event)}/${this.callerId}`, (_, result: T) => {
        this.zone.run(() => {
          // if (result?.err) {
          //   subscriber.error(result.err);
          // } else {
          subscriber.next(result);
          // }
          subscriber.complete();
        });
      });
      this.ipcRenderer.send(event, this.callerId, payload);
    });
  }
}
