import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethods } from '../../../../shared/enums/PaymentMethods';
import { PaymentType } from '../../../../shared/types/IOrder';
import { IOrderItem } from '../../../../shared/types/IOrderItem';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  orderDate: Date;

  @Column({ nullable: true })
  operatorId?: number;

  @Column()
  paymentMethod: PaymentMethods;

  @Column({ nullable: true })
  paymentType: PaymentType;

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

  @Column({ nullable: true })
  shiftId?: number;

  @Column({ nullable: true })
  orderTotalPrice?: number;

  @Column({ nullable: true })
  guestCount?: number;

  @Column({ nullable: true })
  tableId?: number;

  public static CreateNew(
    orderDate: Date,
    operatorId: number,
    paymentMethod: PaymentMethods,
    paymentType: PaymentType,
    transactionId: string,
    taxAmount: number,
    taxRate: number,
    orderLines: IOrderItem[],
    shiftId: number,
    orderTotalPrice: number,
    guestCount?: number,
    tableId?: number,
    externalId?: string
  ): Transaction {
    const instance = new Transaction();
    instance.orderDate = orderDate;
    instance.operatorId = operatorId;
    instance.taxAmount = taxAmount;
    instance.taxRate = taxRate;
    instance.paymentMethod = paymentMethod;
    instance.paymentType = paymentType;
    instance.transactionId = transactionId;
    instance.orderLines = orderLines;
    instance.shiftId = shiftId;
    instance.orderTotalPrice = orderTotalPrice;
    instance.guestCount = guestCount;
    instance.tableId = tableId;
    instance.externalId = externalId;
    instance.canBeReversed = true;
    return instance;
  }
}
