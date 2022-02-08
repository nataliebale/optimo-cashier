import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { StockItem } from './StockItem';

@Entity()
export class IMEI {
  @PrimaryColumn()
  id?: number;

  @Column()
  imei: string;

  @Column()
  status: number;

  @ManyToOne(_ => StockItem, imei => imei.imeis, { nullable: true })
  stockItem?: StockItem;

  public static CreateNew(
    id: number,
    imei: string,
    status: number,
    stockItemId: number
  ): IMEI {
    const instance = new IMEI();
    const stockItem = new StockItem();

    stockItem.id = stockItemId;
    instance.id = id;
    instance.imei = imei;
    instance.status = status;
    instance.stockItem = stockItem;

    return instance;
  }
}
