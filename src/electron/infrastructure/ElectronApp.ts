import { App, app, protocol, ipcMain } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request-promise-native';
import { Constants } from '../../core/Constants';
import { ApplicationDb } from '../../core/infrastructure/ApplicationDb';
import { DeviceService } from '../../core/services/Device/DeviceService';
import { JobService } from '../../core/services/Job/JobService';
import { SettingsService } from '../../core/services/Settings/SettingService';
import { ShiftService } from '../../core/services/Shift/ShiftService';
import { UpdateService } from '../../core/services/Update/UpdateService';
import { appStartTime } from '../main';
import { RegisterControllers, RegisterRoutes } from '../routes/Router';
import { DIContainer, DIControllerBinder } from '../../core/infrastructure/DependencyInjection';
import { WindowManager } from './WindowManager';
import { HttpAdapter } from '../../core/services/Http/HttpAdapter';
import { Environment } from '../../shared/enums/Environment';
import { ElectronDIContainer } from './ElectronDependencyInjection';
import { SystemEventService } from '../../core/services/SystemEvent/SystemEventService';
import { OdinEvent } from '../../shared/enums/OdinEvent';
import { TransactionDb } from '../../core/infrastructure/TransactionDb';
import { MigrationService } from '../../core/services/Migration/MigrationService';

export class ElectronApp {
  private app: App;

  private _db: ApplicationDb;
  private _transactionDb: TransactionDb;
  private _settings: SettingsService;
  private _shiftService: ShiftService;
  private _windowManager: WindowManager;
  private _updateService: UpdateService;
  private _jobs: JobService;
  private _deviceService: DeviceService;
  private _httpService: HttpAdapter;

  constructor() {
    this.app = app;
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      app.quit();
    }

    process.env.APP_VER = this.app.getVersion();

    log.transports.file.level = 'verbose';
    log.transports.console.level = 'debug';

    const channel = process.env.APP_VER.split('-')[1];
    autoUpdater.autoDownload = false;
    autoUpdater.channel = channel ? channel : 'latest';
    autoUpdater.logger = log;

    this._db = DIContainer.get<ApplicationDb>(ApplicationDb);
    this._transactionDb = DIContainer.get<TransactionDb>(TransactionDb);
    this._settings = DIContainer.get<SettingsService>(SettingsService);
    this._shiftService = DIContainer.get<ShiftService>(ShiftService);
    this._windowManager = DIContainer.get<WindowManager>(WindowManager);
    this._updateService = DIContainer.get<UpdateService>(UpdateService);
    this._jobs = DIContainer.get<JobService>(JobService);
    this._deviceService = DIContainer.get<DeviceService>(DeviceService);
    this._httpService = DIContainer.get<HttpAdapter>(HttpAdapter);
  }

  public async Start(): Promise<void> {
    this.app.on('window-all-closed', () => {
      log.info('პროგრამის გათიშვა');
      if (process.platform !== 'darwin') {
        this.app.quit();
      }
    });

    this.app.on('activate', async () => {
      if (!this._windowManager.HasWindow) {
        await this._windowManager.ShowSplashScreen();
        await this._windowManager.ShowMainWindow();
      }
    });

    await this.Prepare();
    await this._windowManager.ShowSplashScreen();
    log.log('App Boot Time: ', (new Date().getTime() - appStartTime) / 1000);
    process.env.USER_AGENT = `${this._windowManager.CurrentWindow.webContents.userAgent} Optimo/${process.env.APP_VER}`;
    await this.Run();
    await this._windowManager.ShowMainWindow();
  }

  private async Run() {
    await this._db.Init();
    await this._transactionDb.Init();
    await this._settings.Init();
    await this._httpService.Init();
    await this._shiftService.Run();
    await this._deviceService.Run();
    await this._updateService.Run();
    await MigrationService.Run(DIContainer);

    if (this._settings.data.isInited) {
      log.info('დავალებების დაწყება');
      await this._jobs.Run();
    }

    RegisterControllers(DIControllerBinder);
    RegisterRoutes(ElectronDIContainer);
  }

  private async Prepare(): Promise<void> {
    ipcMain.on(OdinEvent.SUBSCRIBE, (event, callerId, arg) => {
      console.log('got subscription event');
      ElectronDIContainer.get(SystemEventService).subscribe(event, callerId, arg);
    });
    protocol.registerFileProtocol('cached-images', async (req, callback) => {
      let file = req.url.substr('cached-images'.length + 3);
      file = unescape(file.substr(0, file.length - 1));

      let url = path.join(this.app.getPath('userData'), 'odinImages', file);
      url = path.normalize(url);

      fs.stat(url, async (error, stats) => {
        try {
          if (error || !stats.size) {
            const externalUrl = file.replace(/\$\$\$/g, '://').replace(/\$/g, '/');
            await this.savePhotos(
              `${this.app.getPath('userData')}/odinImages/${file}`,
              externalUrl
            );
          }
        } catch (e) {
          log.warn('გაუთვალისწინებელი შეცდომა სურათების დამუშავებისას', e);
        } finally {
          callback(url);
        }
      });
    });

    protocol.interceptFileProtocol(Constants.PROTOCOL, (req, callback) => {
      let url = req.url.substr(Constants.PROTOCOL.length + 1);
      url = path.join(Constants.WEB_FOLDER, url).split('#')[0];
      callback(url);
    });

    if (!fs.existsSync(`${app.getPath('userData')}/odinImages`)) {
      fs.mkdir(`${app.getPath('userData')}/odinImages`, function () {});
    }
  }

  private async savePhotos(photoPath: string, url: string) {
    try {
      return await new Promise((resolve, reject) => {
        request.head(url, function (err, res, body) {
          request(url)
            .pipe(fs.createWriteStream(photoPath))
            .on('close', () => resolve());
        });
      });
    } catch (err) {
      console.warn('warn', err);
      log.error('გაუთვალისწინებელი შეცდომა ფოტოების გადმოწერისას:', err, err.stack);
    }
  }
}
