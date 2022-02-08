import { PaymentType } from './../../../../shared/types/IOrder';
import { TransactionStatus } from './TransactionStatus';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PaymentMethods } from '../../../../shared/enums/PaymentMethods';
import { IOrderItem } from '../../../../shared/types/IOrderItem';
import { Transaction } from './Transaction';
import { TransactionLogOrderLine } from './TransactionLogOrderLine';

@Entity()
export class TransactionLog {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  orderDate: Date;

  @Column({ nullable: true })
  operatorId?: number;

  @Column()
  paymentMethod: PaymentMethods;

  @Column()
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

  @OneToMany((_) => TransactionLogOrderLine, (itm) => itm.transaction)
  orderLines: TransactionLogOrderLine[];

  @Column({ nullable: true })
  shiftId?: number;

  @Column({ nullable: true })
  orderTotalPrice?: number;

  @Column({ nullable: true })
  guestCount?: number;

  @Column({ nullable: true })
  tableId?: number;

  @Column({ default: 0 })
  status?: TransactionStatus;
}
