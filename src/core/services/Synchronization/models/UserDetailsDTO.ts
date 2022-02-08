export interface UserDetailsDTO {
  companyName: string;
  brandName: string;
  identificationNumber: string;
  companyType: number;
  creationDate: Date;
  legalEntityCreationDate: Date;
  businessType: number[];
  phoneNumber?: any;
  email?: any;
  address: string;
  legalAddress: string;
  phones?: any;
  isWATRegistered: boolean;
  isEntitySaleEnabled: boolean;
  packageType: string;
  legalEntityData?: any;
  taxRate: number;
}
