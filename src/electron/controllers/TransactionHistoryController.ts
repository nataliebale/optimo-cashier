import { IpcController, IpcMain } from '../infrastructure/IpcDecorators';
import { injectable, inject } from 'inversify';
import { IResult } from '../../shared/types/IResult';
import { TransactionHistoryService } from '../../core/services/History/TransactionHistoryService';
import { ITransactionListItem } from '../../shared/types/ITransactionList';
import { ITransactionHistoryFilterWithSearch } from '../../shared/types/ITransactionHistoryFilter';
import { ITransactionDetails } from '../../shared/types/ITransactionDetails';

@IpcController()
@injectable()
export class TransactionHistoryController {
  constructor(
    @inject(TransactionHistoryService)
    private readonly _transactionHistroyService: TransactionHistoryService
  ) {}

  @IpcMain('getTransactionHistoryList')
  async getSpaces(payload: {
    filter: ITransactionHistoryFilterWithSearch;
    entity: boolean;
  }): Promise<IResult<ITransactionListItem[]>> {
    return {
      data: await this._transactionHistroyService.getTransactionHistoryList(
        payload.filter,
        payload.entity
      ),
    };
  }

  @IpcMain('getTransactionDetails')
  async getTablesWithStatus(payload: {
    transactionId: number;
    entity: boolean;
  }): Promise<IResult<ITransactionDetails>> {
    return {
      data: await this._transactionHistroyService.getTransactionDetails(
        payload.transactionId,
        payload.entity
      ),
    };
  }
}
