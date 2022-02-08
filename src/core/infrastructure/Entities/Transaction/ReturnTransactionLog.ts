import { IReturnedStockItem } from '../../../../shared/types/IReturnedStockItem';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { SaleReturnReason } from '../../../../shared/enums/SaleReturnReason';
import { ReturnTransactionStatus } from './ReturnTransactionStatus';

@Entity()
export class ReturnTransactionLog {
  @PrimaryColumn()
  id: string;

  @Column()
  returnedTransactionId: string;

  @Column({ nullable: true })
  newTransactionId?: string;

  @Column({ type: 'simple-json' })
  delistedStockItems: IReturnedStockItem[];

  @Column()
  returnDate: Date;

  @Column()
  reason: SaleReturnReason;

  @Column()
  status: ReturnTransactionStatus;

  @Column({default: 1})
  operatorId: number

  @Column({default: 1})
  shiftId: number
}
