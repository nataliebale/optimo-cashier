import { EntityPaymentType } from './../../../../shared/types/IEntityOrder';
import { TransactionStatus } from './TransactionStatus';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransportationType } from '../../../../shared/types/ETransportationType';
import { EntityPaymentMethods } from '../../../../shared/enums/EntityPaymentMethods';
import { IOrderItem } from '../../../../shared/types/IOrderItem';

@Entity()
export class EntityTransactionLog {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  entityIdentifier: string;

  @Column()
  entityName: string;

  @Column({ nullable: true })
  entityType: string;

  @Column({ default: false })
  hasTransportation: boolean;

  @Column({ default: '' })
  startAddress: string;

  @Column({ nullable: true })
  endAddress: string;

  @Column({ nullable: true })
  driverPIN?: string;

  @Column({ nullable: true })
  driverName?: string;

  @Column({ nullable: true })
  driverCarNumber?: string;

  @Column({ nullable: true })
  driverIsForeignСitizen?: boolean;

  @Column({ nullable: true })
  transportationType?: TransportationType;

  @Column({ nullable: true })
  transportName?: string;

  @Column({ nullable: true })
  comment?: string;

  @Column()
  orderDate: Date;

  @Column({ nullable: true })
  operatorId?: number;

  @Column()
  paymentMethod: EntityPaymentMethods;

  @Column({ nullable: true })
  paymentType: EntityPaymentType;

  @Column()
  transactionId: string;

  @Column({ default: 0 })
  taxAmount: number;

  @Column({ default: 0 })
  taxRate: number;

  @Column({ nullable: true })
  transactionDescription?: string;

  @Column({ nullable: true })
  externalId?: string;

  @Column('simple-json')
  orderLines: IOrderItem[];

  @Column({
    nullable: true,
  })
  shiftId?: number;

  @Column({ nullable: true })
  orderTotalPrice?: number;

  @Column({ nullable: true })
  entityClientId?: number;

  @Column({ nullable: true })
  guestCount?: number;

  @Column({ nullable: true })
  tableId?: number;

  @Column({ default: 0 })
  status?: TransactionStatus;
}
