import { IOrderItem } from '../../../../shared/types/IOrderItem';
import { TransactionLog } from './TransactionLog';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class TransactionLogOrderLine implements IOrderItem {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: 0 })
  totalPrice: number;

  @Column({nullable: true})
  barcode: string;

  @Column()
  stockItemId: number;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  unitPrice: number;

  @Column({ nullable: true })
  discountRate?: number;

  @Column({ nullable: true })
  stockItemIMEI?: string;

  @Column({ default: 1 })
  unitOfMeasurement: number;

  @ManyToOne((_) => TransactionLog, (tr) => tr.orderLines, { nullable: true })
  transaction?: TransactionLog;
}
