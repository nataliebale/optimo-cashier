import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IMEI } from './IMEI';
import { StockItemCategory } from './StockItemCategory';
import { Supplier } from '../Supplier/Supplier';

@Entity()
export class StockItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  photoPath: string;

  @Column()
  barcode: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  unitPrice: number;

  @Column({ default: 1 })
  status: number;

  @Column({ nullable: true })
  unitOfMeasurement?: number;

  @Column({ default: 0 })
  soldQuantity?: number;

  @Column({ nullable: true })
  unitPriceMin?: number;

  @Column({ nullable: true })
  lowStockThreshold: number;

  @Column({ nullable: true })
  dashboardPriority?: number;

  @ManyToOne((_) => StockItemCategory, (cat) => cat.stockItems, { nullable: true })
  category?: StockItemCategory;

  @ManyToMany((_) => Supplier, (supplier) => supplier.stockItems)
  suppliers?: Supplier[];

  hasIMEI?: boolean;
  imei?: string;
  isReceipt?: boolean;

  @OneToMany((_) => IMEI, (itm) => itm.stockItem)
  imeis?: IMEI[];

  public static CreateNew(
    id: number,
    photoUrl: string,
    photoPath: string,
    barcode: string,
    name: string,
    quantity: number,
    unitPrice: number,
    status: number,
    unitOfMeasurement: number,
    unitPriceMin: number,
    lowStockThreshold: number,
    dashboardPriority: number,
    categoryId: number
  ): StockItem {
    const instance = new StockItem();
    const category = new StockItemCategory();
    category.id = categoryId;
    instance.category = category;
    instance.id = id;
    instance.photoUrl = photoUrl;
    instance.photoPath = photoPath;
    instance.barcode = barcode;
    instance.name = name;
    instance.quantity = quantity;
    instance.unitPrice = unitPrice;
    instance.status = status;
    instance.unitOfMeasurement = unitOfMeasurement;
    instance.unitPriceMin = unitPriceMin;
    instance.lowStockThreshold = lowStockThreshold;
    instance.dashboardPriority = dashboardPriority;
    return instance;
  }
}
