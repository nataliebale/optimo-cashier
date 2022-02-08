import { EntityPaymentType } from '../../../../shared/types/IEntityOrder';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityPaymentMethods } from '../../../../shared/enums/EntityPaymentMethods';
import { IOrderItem } from '../../../../shared/types/IOrderItem';
import { TransportationType } from '../../../../shared/types/ETransportationType';

@Entity()
export class EntityTransaction {
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
  endAddress?: string;

  @Column({ nullable: true })
  driverPIN?: string;

  @Column({ nullable: true })
  driverName?: string;

  @Column({ nullable: true })
  driverCarNumber?: string;

  @Column({ nullable: true })
  driverIsForeignСitizen?: boolean;

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

  @Column({ default: false })
  canBeReversed: boolean;

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

  @Column({ nullable: true })
  transportationType?: TransportationType;

  @Column({ nullable: true })
  transportName?: string;

  public static CreateNew(
    entityIdentifier: string,
    entityName: string,
    entityType: string,
    orderDate: Date,
    hasTransportation: boolean,
    startAddress: string,
    endAddress: string,
    paymentMethod: EntityPaymentMethods,
    paymentType: EntityPaymentType,
    transactionId: string,
    taxAmount: number,
    taxRate: number,
    orderLines: IOrderItem[],
    shiftId: number,
    orderTotalPrice: number,
    driverPIN?: string,
    driverName?: string,
    driverCarNumber?: string,
    driverIsForeignСitizen?: boolean,
    transportationType?: TransportationType,
    transportName?: string,
    comment?: string,
    operatorId?: number,
    transactionDescription?: string,
    entityClientId?: number,
    guestCount?: number,
    tableId?: number,
    externalId?: string
  ): EntityTransaction {
    const instance = new EntityTransaction();
    instance.entityIdentifier = entityIdentifier;
    instance.entityName = entityName;
    instance.entityType = entityType;
    instance.orderDate = orderDate;
    instance.hasTransportation = hasTransportation;
    instance.startAddress = startAddress;
    instance.endAddress = endAddress; // ODIN-5763 RS issue
    instance.paymentMethod = paymentMethod;
    instance.paymentType = paymentType;
    instance.transactionId = transactionId;
    instance.taxAmount = taxAmount;
    instance.taxRate = taxRate;
    instance.orderLines = orderLines;
    instance.shiftId = shiftId;
    instance.orderTotalPrice = orderTotalPrice;
    instance.driverPIN = driverPIN;
    instance.driverName = driverName;
    instance.driverCarNumber = driverCarNumber;
    instance.driverIsForeignСitizen = driverIsForeignСitizen;
    instance.comment = comment;
    instance.operatorId = operatorId;
    instance.transactionDescription = transactionDescription;
    instance.entityClientId = entityClientId;
    instance.guestCount = guestCount;
    instance.tableId = tableId;
    instance.transportName = transportName;
    instance.transportationType = transportationType;
    instance.externalId = externalId;
    instance.canBeReversed = true;
    return instance;
  }
}
