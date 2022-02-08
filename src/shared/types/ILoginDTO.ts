import { TokenType } from '../enums/TokenType';
import { UserType } from '../enums/UserType';
import { OptimoProductType } from '../enums/OptimoProductType';

export interface ILoginDTO {
  accessToken: string;
  expires: number;
  role: string;
  userType: UserType;
  tokenType: TokenType;
  productType: OptimoProductType;
}
