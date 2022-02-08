import { OptimoProductType } from '../enums/OptimoProductType';

export interface ILegalEntityListModel {
  identificationNumber: string;
  companyName: string;
  id: string;
  uid: string;
  productType: OptimoProductType;
}
