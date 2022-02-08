import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StockItem } from '../StockItem/StockItem';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  status: number;

  @ManyToMany((_) => StockItem, (item) => item.suppliers)
  @JoinTable()
  stockItems?: StockItem[];

  public static CreateNew(id: number, name: string, status: number): Supplier {
    const instance = new Supplier();
    instance.id = id;
    instance.name = name;
    instance.status = status;
    return instance;
  }
}
