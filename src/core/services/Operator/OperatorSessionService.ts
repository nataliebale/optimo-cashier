import { SettingsService } from './../Settings/SettingService';
import { OperatorQueries } from './../../queries/OperatorQueries';
import { ShiftNotClosedException } from './../../../shared/exceptions/ShiftNotCloseException';
import { OperatorSessionActionType, OperatorSessionAction } from './../../infrastructure/Entities';
import { SynchronizationService } from './../Synchronization/SynchronizationService';
import { ShiftService } from './../Shift/ShiftService';
import { injectable, inject } from 'inversify';
import { ApplicationDb } from '../../infrastructure/ApplicationDb';
import { OperatorService } from './OperatorService';
import { OperatorAlreadyLoggedInException } from '../../../shared/exceptions/OperatorAlreadyLoggedInException';
import { CommonFunctions } from '../../../shared/CommonFunctions';
import { OperatorNotAuthedException } from '../../../shared/exceptions/OperatorNotAuthedException';
import { OperatorSession } from '../../infrastructure/Entities';
import { CheckService } from '../Check/CheckService';
import { OperatorHasActiveChecksException } from '../../../shared/exceptions/OperatorHasActiveChecksException';
import { OperatorPermissions } from '../../../shared/enums/OperatorPermissions';
import { OptimoProductType } from '../../../shared/enums/OptimoProductType';

@injectable()
export class OperatorSessionService {
  constructor(
    @inject(ApplicationDb) private readonly _db: ApplicationDb,
    @inject(OperatorService) private readonly _operatorService: OperatorService,
    @inject(ShiftService) private readonly _shiftService: ShiftService,
    @inject(SynchronizationService) private readonly _syncService: SynchronizationService,
    @inject(CheckService) private readonly _checkService: CheckService,
    @inject(SettingsService) private readonly _settingsService: SettingsService
  ) {}

  async logOutOnBoot() {
    const operators = (await new OperatorQueries(this._db).getOperators()).map((item) =>
      item.isLoggedIn ? item : null
    );

    for (const operator of operators) {
      try {
        // console.log(operator.id);
        await this.logOut(operator.id);
      } catch (e) {}
    }
  }

  async logIn(id: number, pinCode: string) {
    if (this._operatorService.currentOperatorId && this._operatorService.currentOperatorId != id) {
      throw new OperatorAlreadyLoggedInException();
    }

    const operator = await this._db.operatorRepository.findOne({
      where: { id: id },
    });
    const hashedPinCode = CommonFunctions.MD5(pinCode).toUpperCase();

    if (!operator) {
      return false;
    }

    if (operator.pinCode.toUpperCase() !== hashedPinCode) {
      return false;
    }

    if (!this._shiftService.currentShiftId) {
      await this._operatorService.requirePermission(
        OperatorPermissions.canOpenShift,
        false,
        operator.id
      );
    }

    let session = await this._db.operatorSessionRepository.findOne({
      where: { operator: { id } },
    });

    if (!session) {
      session = await this._db.operatorSessionRepository.save(
        OperatorSession.CreateNew(new Date(), operator.id)
      );

      await this._db.operatorSessionActionRepository.save(
        OperatorSessionAction.CreateNew(
          OperatorSessionActionType.Login,
          session.id,
          session.loginDate,
          session.operator.id
        )
      );

      this._syncService.syncOperatorSessionActions();
    }

    this._operatorService.currentOperatorId = operator.id;
    return true;
  }

  async switchOperator() {
    if (!this._operatorService.currentOperatorId) {
      throw new OperatorNotAuthedException();
    }

    this._checkService.unsetActive();
    this._operatorService.currentOperatorId = null;
  }

  async logOut(operatorId?: number) {
    if (!operatorId) {
      operatorId = this._operatorService.currentOperatorId;
    }

    if (!operatorId) {
      throw new OperatorNotAuthedException();
    }

    const session = await this._db.operatorSessionRepository.findOne({
      where: { operator: { id: operatorId } },
      relations: ['operator'],
    });

    if (!session) {
      throw new Error('Session was not found');
    }

    await this._checkService.removeUnusedChecks(operatorId);

    if (await this._checkService.operatorHasChecks(operatorId)) {
      throw new OperatorHasActiveChecksException();
    }

    const currentShift = await this._shiftService.getCurrentShift();

    if (
      currentShift &&
      currentShift.startOperatorId == operatorId &&
      this._settingsService.data.productType == OptimoProductType.Retail
    ) {
      throw new ShiftNotClosedException();
    }

    session.logoutDate = new Date();
    await this._db.operatorSessionRepository.delete(session.id);
    await this._db.operatorSessionLogRepository.save(session);
    await this._db.operatorSessionActionRepository.save(
      OperatorSessionAction.CreateNew(
        OperatorSessionActionType.Logout,
        session.id,
        session.logoutDate,
        session.operator.id
      )
    );

    this._syncService.syncOperatorSessionActions();

    this._operatorService.currentOperatorId = null;
  }
}
