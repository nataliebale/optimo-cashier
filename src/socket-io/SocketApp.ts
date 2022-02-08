import { ApplicationDb } from '../core/infrastructure/ApplicationDb';
import { SettingsService } from '../core/services/Settings/SettingService';
import { ShiftService } from '../core/services/Shift/ShiftService';
import { UpdateService } from '../core/services/Update/UpdateService';
import { JobService } from '../core/services/Job/JobService';
import { DeviceService } from '../core/services/Device/DeviceService';
import { HttpAdapter } from '../core/services/Http/HttpAdapter';
import {
  DIContainer,
  DIControllerBinder,
  DIBind,
} from '../core/infrastructure/DependencyInjection';
import log from 'electron-log';
import * as fs from 'fs';
import * as request from 'request-promise-native';
import { RegisterControllers, RegisterRoutes } from './Router';
import { Constants } from '../core/Constants';
import { TransactionDb } from '../core/infrastructure/TransactionDb';
import { MigrationService } from '../core/services/Migration/MigrationService';
import { Server } from 'http';
import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import * as cors from 'cors';

export class SocketApp {
  private _httpServer: Server;
  private _socketioApp: SocketIO.Server;
  private _expressApp: express.Express;
  private _db: ApplicationDb;
  private _transactionDb: TransactionDb;
  private _settings: SettingsService;
  private _shiftService: ShiftService;
  private _updateService: UpdateService;
  private _jobs: JobService;
  private _deviceService: DeviceService;
  private _httpService: HttpAdapter;

  constructor() {
    process.env.APP_VER = 'ვებ ვერსია';
    this.Init();
  }

  private Init() {
    this._db = DIContainer.get<ApplicationDb>(ApplicationDb);
    this._transactionDb = DIContainer.get<TransactionDb>(TransactionDb);
    this._settings = DIContainer.get<SettingsService>(SettingsService);
    this._shiftService = DIContainer.get<ShiftService>(ShiftService);
    this._updateService = DIContainer.get<UpdateService>(UpdateService);
    this._jobs = DIContainer.get<JobService>(JobService);
    this._deviceService = DIContainer.get<DeviceService>(DeviceService);
    this._httpService = DIContainer.get<HttpAdapter>(HttpAdapter);
  }

  public async Start() {
    process.env.USER_AGENT = 'Optimo';
    await this.Prepare();
    await this.Run();
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
    this.RunSocketServer();
  }

  private RunSocketServer() {
    this._expressApp = express();
    this._httpServer = http.createServer(this._expressApp);
    this._socketioApp = socketio(this._httpServer);
    this._expressApp.use(cors());
    this._expressApp.use(express.static(__dirname + '/../web'));
    this._expressApp.get('/', (req, res) => {
      res.sendFile(__dirname + '/../web/index.html');
    });
    this._expressApp.get('/app/restart', (req, res) => {
      res.send();
      this.Rerun();
    });
    this._socketioApp.on('connection', (socket) => {
      RegisterRoutes(socket, DIContainer);
    });

    this._httpServer.listen(8899);
  }

  private async Rerun() {
    this._httpServer.removeAllListeners();
    this._expressApp.removeAllListeners();
    this._socketioApp.close();
    this._httpServer.close();
    DIContainer.unbindAll();
    DIBind();
    this.Init();
    this.Run();
  }

  private async Prepare(): Promise<void> {
    if (!fs.existsSync(`${Constants.UserData}/odinImages`)) {
      fs.mkdir(`${Constants.UserData}/odinImages`, function () {});
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
