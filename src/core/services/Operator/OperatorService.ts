import * as base32 from 'hi-base32';
import { inject, injectable } from 'inversify';
import * as otplib from 'otplib';
import { PrivilegePasswordUsedException } from '../../../shared/exceptions/PrivilegePasswordUsedException';
import { WrongPrivilegePasswordException } from '../../../shared/exceptions/WrongPrivilegePasswordException';
import { ApplicationDb } from '../../infrastructure/ApplicationDb';
import { MoreThanDate } from '../../infrastructure/DbExtensions';
import { SettingsService } from '../Settings/SettingService';
import { Operator } from '../../infrastructure/Entities';
import { OperatorPermissions } from '../../../shared/enums/OperatorPermissions';
import { OperatorHasNoPermissionException } from '../../../shared/exceptions/OperatorHasNoPermissionException';

@injectable()
export class OperatorService {
  public currentOperatorId?: number;
  public isPrivilegeElevated = false;

  constructor(
    @inject(ApplicationDb) private readonly _db: ApplicationDb,
    @inject(SettingsService) private readonly _settings: SettingsService
  ) {}

  async submitPrivilegeElevationPassword(password: string) {
    await this._db.totpRepository.insert({
      totp: password,
      useDate: new Date(),
    });

    this.isPrivilegeElevated = false;
  }

  async checkPrivilegeElevationPassword(password: string, operatorId: number) {
    const now = new Date();
    const isUsed = await this._db.totpRepository.count({
      where: {
        totp: password,
        useDate: MoreThanDate(
          new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000 - 1200000)
        ),
      },
    });

    if (isUsed) {
      throw new PrivilegePasswordUsedException();
    }

    const secret = base32.encode(`${this._settings.data.uid}-${operatorId}`);
    otplib.authenticator.options = {
      step: 15,
      window: 40,
    };

    if (otplib.authenticator.verify({ token: password, secret })) {
      return true;
    } else {
      throw new WrongPrivilegePasswordException();
    }
  }

  async requestPrivelegeElevationByPassword(password: string) {
    return (this.isPrivilegeElevated = await this.checkPrivilegeElevationPassword(
      password,
      this.currentOperatorId
    ));
  }

  async getCurrentOperator(): Promise<Operator> {
    return await this._db.operatorRepository.findOne(this.currentOperatorId);
  }

  async getOperatorById(operatorId: number): Promise<Operator> {
    return await this._db.operatorRepository.findOne(operatorId);
  }

  async hasPermission(
    permission: OperatorPermissions,
    canBeElevated = false,
    operatorId?: number
  ): Promise<boolean> {
    const currentOperator = operatorId
      ? await this.getOperatorById(operatorId)
      : await this.getCurrentOperator();
    return currentOperator.permissions[permission] || (canBeElevated && this.isPrivilegeElevated);
  }

  async requirePermission(
    permission: OperatorPermissions,
    canBeElevated = false,
    operatorId?: number
  ): Promise<void> {
    if (!(await this.hasPermission(permission, canBeElevated, operatorId))) {
      throw new OperatorHasNoPermissionException(permission);
    }
  }
}
