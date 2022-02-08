import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethod } from '../../../../shared/enums/PaymentMethod';
import { PurchaseOrderStatus } from '../../../../shared/enums/PurchaseOrderStatus';
import { PurchaseOrderLine } from './PurchaseOrderLine';
import { Supplier } from '../Supplier/Supplier';

@Entity()
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  locationId: number;

  @Column()
  paymentMethod: PaymentMethod;

  @Column()
  name: string;

  @Column({ nullable: true })
  orderDate: Date;

  @Column()
  expectedReceiveDate: Date;

  @Column({ nullable: true })
  receiveDate?: Date;

  @Column()
  status: PurchaseOrderStatus;

  @Column({ type: 'decimal' })
  expectedTotalCost: number;

  @Column({ type: 'decimal', nullable: true })
  receivedTotalCost: number;

  @Column({ nullable: true })
  comment?: string;

  @ManyToOne((_) => Supplier)
  supplier: Supplier;

  @OneToMany((_) => PurchaseOrderLine, (line) => line.purchaseOrder)
  purchaseOrderLines?: PurchaseOrderLine[];

  public static CreateNew(
    id: number,
    locationId: number,
    paymentMethod: PaymentMethod,
    name: string,
    orderDate: Date,
    expectedReceiveDate: Date,
    status: PurchaseOrderStatus,
    expectedTotalCost: number,
    receivedTotalCost: number,
    supplierId: number,
    receiveDate?: Date,
    comment?: string
  ): PurchaseOrder {
    const instance = new PurchaseOrder();
    const supplier = new Supplier();
    supplier.id = supplierId;
    instance.id = id;
    instance.locationId = locationId;
    instance.paymentMethod = paymentMethod;
    instance.name = name;
    instance.orderDate = orderDate;
    instance.expectedReceiveDate = expectedReceiveDate;
    instance.status = status;
    instance.expectedTotalCost = expectedTotalCost;
    instance.receivedTotalCost = receivedTotalCost;
    instance.receiveDate = receiveDate;
    instance.comment = comment;
    instance.supplier = supplier;
    return instance;
  }
}
