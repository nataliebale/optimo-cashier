import { IClockDriftStatus } from './../../shared/types/IClockDriftStatus';
import { ClockService } from './../../core/services/Clock/ClockService';
import { inject, injectable } from 'inversify';
import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { IResult } from '../../shared/types/IResult';

@IpcController()
@injectable()
export class ClockController {
  constructor(@inject(ClockService) private readonly _clockService: ClockService) {}

  @IpcMain('clock/checkStatus')
  setTable(): IResult<IClockDriftStatus> {
    return { data: this._clockService.getLastClockDriftStatus() };
  }

  @IpcMain('clock/warningShown')
  async warningShownAsync(arg): Promise<IResult<boolean>> {
    await this._clockService.clockDriftWarningShownAsync(arg.timeShown);
    return { data: true };
  }
}
