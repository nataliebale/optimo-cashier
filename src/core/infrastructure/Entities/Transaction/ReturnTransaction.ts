import { ReturnTransactionStatus } from './ReturnTransactionStatus';
import { CommonFunctions } from './../../../../shared/CommonFunctions';
import { IReturnedStockItem } from './../../../../shared/types/IReturnedStockItem';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { SaleReturnReason } from '../../../../shared/enums/SaleReturnReason';

@Entity()
export class ReturnTransaction {
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

  public static CreateNew(
    reason: SaleReturnReason,
    returnedTransactionId: string,
    operatorId: number,
    shiftId: number,
    newTransactionId?: string,
    delistedStockItems?: IReturnedStockItem[],
  ): ReturnTransaction {
    const instance = new ReturnTransaction();
    instance.id = CommonFunctions.generateGuid();
    instance.reason = reason;
    instance.returnedTransactionId = returnedTransactionId;
    instance.operatorId = operatorId;
    instance.shiftId = shiftId;
    instance.newTransactionId = newTransactionId;
    instance.delistedStockItems = delistedStockItems;
    instance.status = ReturnTransactionStatus.PendingReversal;
    instance.returnDate = new Date();
    return instance;
  }
}
