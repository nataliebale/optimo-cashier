import { OperatorPermissions } from '../enums/OperatorPermissions';

export class OperatorHasNoPermissionException extends Error {
  name = 'OperatorHasNoPermissionException';

  constructor(permission: OperatorPermissions) {
    super(`Permission declined: ${permission}`);
  }
}
