import { OdinCardProvider } from '../enums/OdinCardProvider';

export interface IReverseCardTransaction {
  externalId: string;
  cardProvider: OdinCardProvider;
}
