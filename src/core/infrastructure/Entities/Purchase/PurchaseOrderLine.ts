import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseOrder } from './PurchaseOrder';
import { StockItem } from '../StockItem/StockItem';

@Entity()
export class PurchaseOrderLine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderedQuantity: number;

  @Column({ type: 'decimal' })
  expectedUnitCost: number;

  @Column({ type: 'decimal' })
  expectedTotalCost: number;

  @Column()
  receivedQuantity: number;

  @Column({ type: 'decimal' })
  receivedUnitCost: number;

  @Column({ type: 'decimal' })
  receivedTotalCost: number;

  @ManyToOne((_) => StockItem)
  stockItem: StockItem;

  @ManyToOne((_) => PurchaseOrder, (order) => order.purchaseOrderLines, { nullable: true })
  purchaseOrder?: PurchaseOrder;

  public static CreateNew(
    id: number,
    orderedQuantity: number,
    expectedUnitCost: number,
    expectedTotalCost: number,
    receivedQuantity: number,
    receivedUnitCost: number,
    receivedTotalCost: number,
    stockItemId: number,
    purchaseOrderId: number
  ): PurchaseOrderLine {
    const instance = new PurchaseOrderLine();
    const stockItem = new StockItem();
    const purchaseOrder = new PurchaseOrder();
    stockItem.id = stockItemId;
    purchaseOrder.id = purchaseOrderId;
    instance.stockItem = stockItem;
    instance.purchaseOrder = purchaseOrder;
    instance.id = id;
    instance.orderedQuantity = orderedQuantity;
    instance.expectedUnitCost = expectedUnitCost;
    instance.expectedTotalCost = expectedTotalCost;
    instance.receivedQuantity = receivedQuantity;
    instance.receivedUnitCost = receivedUnitCost;
    instance.receivedTotalCost = receivedTotalCost;
    return instance;
  }
}
