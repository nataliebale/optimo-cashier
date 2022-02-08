import { inject, injectable } from 'inversify';
import { ShiftService } from '../../core/services/Shift/ShiftService';
import { ICashWithdrawal } from '../../shared/types/ICashWithdrawal';
import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { IShift } from '../../shared/types/IShift';
import { IResult } from '../../shared/types/IResult';
import { IShiftTotalSales } from '../../shared/types/IShiftTotalSale';

@IpcController()
@injectable()
export class ShiftController {
  constructor(
    @inject(ShiftService) private readonly _shiftService: ShiftService
  ) { }

  @IpcMain('startShift')
  async startShift(cashBegin: number): Promise<IResult<IShift>> {
    await this._shiftService.startShift(cashBegin);
    return { data: await this._shiftService.getShift() };
  }

  @IpcMain('finishShift')
  async finishShift(cashEnd: number): Promise<IResult<void>> {
    return { data: await this._shiftService.endShift(cashEnd) };
  }

  @IpcMain('withdrawCash')
  async withdrawCash(data: ICashWithdrawal): Promise<IResult<void>> {
    return { data: await this._shiftService.withdrawCash(data) };
  }

  @IpcMain('getShift')
  async getShift(): Promise<IResult<IShift>> {
    return { data: await this._shiftService.getShift() };
  }

  @IpcMain('getShiftTotalSales')
  async getShiftTotalSales(): Promise<IResult<IShiftTotalSales>> {
    return { data: await this._shiftService.getShiftTotalSalesAmount() };
  }
}
