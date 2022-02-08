import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { CommonFunctions } from '../../../shared/CommonFunctions';
import { Environment } from '../../../shared/enums/Environment';
import { OdinCardProvider } from '../../../shared/enums/OdinCardProvider';
import { OdinCashierProvider } from '../../../shared/enums/OdinCashierProvider';
import { OdinPrinterProvider } from '../../../shared/enums/OdinPrinterProvider';
import { ISettings } from '../../../shared/types/ISettings';
import { ApplicationDb } from '../../infrastructure/ApplicationDb';
import { SettingsEntity } from '../../infrastructure/Entities';
import { OptimoProductType } from '../../../shared/enums/OptimoProductType';

@injectable()
export class SettingsService {
  private _settings: SettingsEntity;
  private _settingId = 1;
  private repository: Repository<SettingsEntity>;

  constructor(
    @inject(ApplicationDb) private readonly _db: ApplicationDb
  ) { }

  async Init() {
    this.repository = this._db.settingsRepository;
    this._settings = await this.repository.findOne(this._settingId);

    if (!this._settings) {
      this._settings = {
        id: this._settingId,
        value: {
          cashier: OdinCashierProvider.NONE,
          card: [OdinCardProvider.NONE],
          env: Environment.Production,
          isInited: false,
          syncDate: new Date(0),
          syncIntervalSec: 1800,
          imeiSyncDate: new Date(0),
          popularSyncDate: new Date(0),
          dayCloseDate: new Date(3000, 1, 1),
          deviceId: CommonFunctions.generateGuid(),
          devicePassword: CommonFunctions.generateGuid(),
          productType: OptimoProductType.Retail,
          bogConfiguration: null,
          receiptPrinter: OdinPrinterProvider.NONE,
          taxRate: 0,
          printerSettings: {
            title: 'მარკეტი'
          }
        }
      };

      await this.repository.save(this._settings);
    }

    await this.seedMigrationDefaults();

    this._settings.value.syncDate = new Date(this._settings.value.syncDate);
    this._settings.value.dayCloseDate = new Date(this._settings.value.dayCloseDate);
    this._settings.value.popularSyncDate = new Date(this._settings.value.popularSyncDate);
    this._settings.value.imeiSyncDate = new Date(this._settings.value.imeiSyncDate);
    process.env.Environment = this._settings.value.env.toString();
  }


  private async seedMigrationDefaults() {
    if (!this._settings.value.env) {
      await this.setProperty(
        p =>
          (p.env = this._settings.value.isDev
            ? Environment.Staging
            : Environment.Production)
      );
    }

    if (!this._settings.value.printerSettings) {
      await this.setProperty(
        p =>
          (p.printerSettings = {
            title: 'მერკეტი'
          })
      );
    }

    if (this._settings.value.isFullScreen == null) {
      await this.setProperty(
        p => p.isFullScreen = true
      );
    }

    if (this._settings.value.hasCashBox == null) {
      await this.setProperty(
        p => p.hasCashBox = false
      );
    }

    if (!this._settings.value.receiptPrinter) {
      await this.setProperty(
        p => {
          switch (this._settings.value.cashier) {
            case OdinCashierProvider.DAISY:
              p.receiptPrinter = OdinPrinterProvider.DAISY;
              break;
            case OdinCashierProvider.KASA:
              p.receiptPrinter = OdinPrinterProvider.KASA;
              break;
            case OdinCashierProvider.NONE:
            default:
              p.receiptPrinter = OdinPrinterProvider.NONE;
              break;
          }
        }
      );
    }

    if (!this._settings.value.imeiSyncDate) {
      await this.setProperty(p => p.imeiSyncDate = new Date(0));
    }

    if (!this._settings.value.syncIntervalSec) {
      await this.setProperty(p => p.syncIntervalSec = 1800);
    }
  }

  public get data(): ISettings {
    return this._settings.value;
  }

  public async set(value: ISettings) {
    this._settings.value = value;
    await this.repository.save(this._settings);
  }

  public async setProperty(func: SettingsProperty) {
    await func(this.data);
    await this.repository.save(this._settings);
  }
}

export type SettingsProperty = (setting: ISettings) => void;
