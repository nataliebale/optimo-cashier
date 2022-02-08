import { inject, injectable } from 'inversify';
import { OdinEvent } from '../../../shared/enums/OdinEvent';
import { HttpAdapter } from '../Http/HttpAdapter';
import { SettingsService } from '../Settings/SettingService';
import { SynchronizationService } from '../Synchronization/SynchronizationService';
import { SystemEventService } from '../SystemEvent/SystemEventService';
import { OperatorSessionService } from '../Operator/OperatorSessionService';

@injectable()
export class JobService {
  private _jobs = {};

  constructor(
    @inject(SynchronizationService) private readonly _syncService: SynchronizationService,
    @inject(HttpAdapter) private readonly _httpAdapter: HttpAdapter,
    @inject(SystemEventService) private readonly _eventService: SystemEventService,
    @inject(SettingsService) private readonly _settings: SettingsService,
    @inject(OperatorSessionService) private readonly _operatorSessionService: OperatorSessionService
  ) {}

  public async Run() {
    this._eventService.sendEvent(OdinEvent.BOOT, 'ინტერნეტის სტატუსის შემოწმება');
    await this._httpAdapter.checkInternetStatus();
    this.addJob(this._httpAdapter.checkInternetStatus.name, 30000, async () => {
      await this._httpAdapter.checkInternetStatus();
    });

    await this._operatorSessionService.logOutOnBoot();

    this._eventService.sendEvent(OdinEvent.BOOT, 'ბაზის სინქრონიზაცია');
    await this._syncService.sync(false, true);
    this.addJob(
      this._syncService.sync.name,
      this._settings.data.syncIntervalSec * 1000,
      async () => {
        await this._syncService.sync();
      }
    );
  }

  private addJob(name: string, ms: number, func: Function) {
    if (this._jobs[name]) {
      clearInterval(this._jobs[name]);
    }

    this._jobs[name] = setInterval(func, ms);
  }
}
