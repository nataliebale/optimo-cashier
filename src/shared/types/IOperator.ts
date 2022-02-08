import { IOperatorPermissions } from './IOperatorPermissions';

export interface IOperator {
  id: number;
  name: string;
  pinCode: string;
  status: number;
  permissions: IOperatorPermissions;
  isLoggedIn?: boolean;
}
