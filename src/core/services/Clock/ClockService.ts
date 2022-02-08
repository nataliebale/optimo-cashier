import { ClockDriftLog } from './../../infrastructure/Entities';
import { inject, injectable } from 'inversify';
import { OdinEvent } from '../../../shared/enums/OdinEvent';
import { IClockDriftStatus } from '../../../shared/types/IClockDriftStatus';
import { ApplicationDb } from '../../infrastructure/ApplicationDb';
import { HttpAdapter } from '../Http/HttpAdapter';
import { SystemEventService } from '../SystemEvent/SystemEventService';
import { ClockDriftWarningLog } from '../../infrastructure/Entities';

@injectable()
export class ClockService {
  private _lastClockDriftStatus: IClockDriftStatus;

  constructor(
    @inject(ApplicationDb) private readonly _db: ApplicationDb,
    @inject(HttpAdapter) private readonly _httpAdapter: HttpAdapter,
    @inject(SystemEventService) private readonly _eventService: SystemEventService
  ) {}

  public async checkClockDriftAsync() {
    const realTime = new Date(
      JSON.parse(await this._httpAdapter.get(this._httpAdapter.API_TIME, true))
    );
    const localTime = new Date();
    const timeDiff = realTime.getTime() - localTime.getTime();
    const hasClockDriftExceededThreashold = timeDiff > 270000 || timeDiff < -270000; // 4:30

    this._lastClockDriftStatus = {
      realTime: realTime,
      localTime: localTime,
      hasClockDriftExceededThreashold: hasClockDriftExceededThreashold,
    };

    this._eventService.sendEvent(OdinEvent.CLOCK_DRIFT_STATUS, this._lastClockDriftStatus);

    if (this._lastClockDriftStatus.hasClockDriftExceededThreashold) {
      await this._db.clockDriftLogRepository.save(ClockDriftLog.CreateNew(localTime, realTime));
    }
  }

  public getLastClockDriftStatus(): IClockDriftStatus {
    return this._lastClockDriftStatus;
  }

  public async clockDriftWarningShownAsync(timeShown: Date) {
    await this._db.clockDriftWarningLogRepository.save(ClockDriftWarningLog.CreateNew(timeShown));
  }
}
