import { IOdinPrinterSettings } from './IOdinPrinterSettings';
import { OdinPrinterProvider } from '../enums/OdinPrinterProvider';
import { Environment } from '../enums/Environment';
import { OdinCashierProvider } from '../enums/OdinCashierProvider';
import { OdinCardProvider } from '../enums/OdinCardProvider';
import { OptimoProductType } from '../enums/OptimoProductType';

export interface ISettings {
  cashier: OdinCashierProvider;
  card: Array<OdinCardProvider>;
  isDev?: boolean;
  env: Environment;
  isInited: boolean;
  syncDate: Date;
  syncIntervalSec: number;
  imeiSyncDate: Date;
  dayCloseDate: Date;
  deviceId: string;
  deviceSerialNumber?: string;
  devicePassword: string;
  popularSyncDate: Date;
  cashierPort?: string;
  uid?: string;
  taxRate: number;
  locationId?: number;
  locationData?: ISettingsLocation;
  productType: OptimoProductType;
  bogConfiguration: IBogConfiguration;
  receiptPrinter?: OdinPrinterProvider;
  printerSettings?: IOdinPrinterSettings;
  isFullScreen?: boolean;
  hasCashBox?: boolean;
  isEntityClientFirstTimeSynced?: boolean;
}

export interface IBogConfiguration {
  hasPrinter: boolean;
}

export interface ISettingsLocation {
  name: string;
  address: string;
  managerName: string;
  phoneNumber: string;
}
