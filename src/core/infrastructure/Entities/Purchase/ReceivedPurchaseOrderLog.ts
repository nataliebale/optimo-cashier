import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IReceivedPurchaseOrderLine } from '../../../../shared/types/IReceivedPurchaseOrder';

@Entity()
export class ReceivedPurchaseOrderLog {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  receiveDate: Date;

  @Column('simple-json')
  orderLines: IReceivedPurchaseOrderLine[];
}
