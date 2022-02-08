import { CommonFunctions } from './../../../shared/CommonFunctions';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { inject, injectable } from 'inversify';
import { OdinEvent } from '../../../shared/enums/OdinEvent';
import { ICheckUpdate } from '../../../shared/types/ICheckUpdate';
import { IDownloadProgress } from '../../../shared/types/IDownloadProgress';
import { SystemEventService } from '../SystemEvent/SystemEventService';

@injectable()
export class UpdateService {
  private _updateCheckStarted = false;
  public updateAvaliable = false;
  private _rebootRequired = false;

  constructor(@inject(SystemEventService) private readonly _eventService: SystemEventService) {}

  installUpdate() {
    if (this.updateAvaliable) {
      autoUpdater.quitAndInstall();
      return true;
    }
    return false;
  }

  async Run() {
    if (process.env.APP_TYPE === 'electron') {
      autoUpdater.autoInstallOnAppQuit = false;
      autoUpdater.allowDowngrade = false;
      autoUpdater.on('update-downloaded', (ev, info) => {
        log.info('UPD: განახლება გადმოწერილია');
        this.updateAvaliable = true;
        this._updateCheckStarted = false;
        this._eventService.sendEvent(OdinEvent.UPDATE_DOWNLOADED, true);
      });
      autoUpdater.on('checking-for-update', () => {
        this._updateCheckStarted = true;
        log.info('UPD: განახლების შემოწმება');
      });
      autoUpdater.on('download-progress', (ev: IDownloadProgress, progressObj) => {
        log.info('UPD: განახლების გადმოწერა');
        this._eventService.sendEvent(OdinEvent.UPDATE_DOWNLOADING, ev);
      });
      autoUpdater.on('update-available', (ev, info) => {
        autoUpdater.downloadUpdate();
        this._eventService.sendEvent(OdinEvent.UPDATE_DOWNLOADING, null);
        log.info('UPD: განახლება ხელმისაწვდომია');
      });
      autoUpdater.on('update-not-available', (ev, info) => {
        this._updateCheckStarted = false;
        log.info('UPD: განახლება ვერ მოიძებნა');
      });
    }
  }

  checkUpdates(): ICheckUpdate {
    return {
      rebootRequired: this._rebootRequired,
      updatesAvaliable: this.updateAvaliable,
    };
  }

  async runUpdateCheckers(): Promise<boolean> {
    if (process.env.APP_TYPE === 'electron') {
      try {
        log.info('UPD: განახლების შემოწმება დაწყებულია => ', this._updateCheckStarted);
        if (process.env.UPDATE && !this._updateCheckStarted) {
          const result = new Promise<boolean>(async (resolve, reject) => {
            let resolved = false;

            const updateNotReady = () => {
              if (!resolved) {
                resolved = true;
                resolve(false);
              }
            };

            const updateReady = () => {
              if (!resolved) {
                resolved = true;
                resolve(true);
              }
            };

            autoUpdater.once('update-downloaded', updateReady);
            autoUpdater.once('download-progress', updateNotReady);
            autoUpdater.once('update-not-available', updateNotReady);
            autoUpdater.once('update-cancelled', updateNotReady);
            autoUpdater.once('error', updateNotReady);
            // fail in 10s
            await CommonFunctions.sleep(10000);
            updateNotReady();
          });
          const check = await autoUpdater.checkForUpdates();
          log.log('updateresult', check);
          return await result;
        } else {
          log.warn('UPD: განახლების შემოწმება მიმდინარეობს');
        }
      } catch (err) {
        log.error(err);
        log.error(err.stack);
      }
    } else {
      return false;
    }
  }
}
