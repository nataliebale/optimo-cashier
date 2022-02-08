import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IReceivedPurchaseOrderLine } from '../../../../shared/types/IReceivedPurchaseOrder';

@Entity()
export class ReceivedPurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  receiveDate: Date;

  @Column('simple-json')
  orderLines: IReceivedPurchaseOrderLine[];

  public static CreateNew(
    id: number,
    receiveDate: Date,
    orderLines: IReceivedPurchaseOrderLine[]
  ): ReceivedPurchaseOrder {
    const instance = new ReceivedPurchaseOrder();
    instance.id = id;
    instance.receiveDate = receiveDate;
    instance.orderLines = orderLines;
    return instance;
  }
}
