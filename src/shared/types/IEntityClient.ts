export interface IEntityClient {
  id: number;
  entityIdentifier: string;
  entityName: string;
  entityType: string;
  description?: string;
  bankAccount: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  isVATRegistered: boolean;
  status: number;
  dashboardPriority?: number;
}
