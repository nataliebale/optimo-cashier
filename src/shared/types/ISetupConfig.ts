import { IBogConfiguration } from './ISettings';
import { OdinCardProvider } from '../enums/OdinCardProvider';
import { OdinCashierProvider } from '../enums/OdinCashierProvider';
import { OdinPrinterProvider } from '../enums/OdinPrinterProvider';
import { IOdinPrinterSettings } from './IOdinPrinterSettings';
import { OptimoProductType } from '../enums/OptimoProductType';

export interface ISetupConfig {
  syncIntervalSec?: number;
  cashier: OdinCashierProvider;
  card: Array<OdinCardProvider>;
  bogConfiguration: IBogConfiguration;
  receiptPrinter: OdinPrinterProvider;
  printerSettings?: IOdinPrinterSettings;
  isFullScreen?: boolean;
  hasCashBox?: boolean;
  legalEntityId?: string;
  locationId: number;
  productType: OptimoProductType;
}
