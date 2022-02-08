import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IStockItemCategory } from '../../../../shared/types/IStockItemCategory';
import { StockItem } from './StockItem';

@Entity()
export class StockItemCategory implements IStockItemCategory {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  status?: number;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ nullable: true })
  photoPath?: string;

  @OneToMany((_) => StockItemCategory, (cat) => cat.parentCategory)
  childCategories?: StockItemCategory[];

  @ManyToOne((_) => StockItemCategory, (cat) => cat.childCategories, { nullable: true })
  parentCategory?: StockItemCategory;

  @OneToMany((_) => StockItem, (itm) => itm.category)
  stockItems?: StockItem[];

  public static CreateNew(
    id: number,
    name: string,
    description?: string,
    status?: number,
    photoUrl?: string,
    photoPath?: string,
    parentCategoryId?: number
  ): StockItemCategory {
    const instance = new StockItemCategory();
    instance.id = id;
    instance.name = name;
    instance.description = description;
    instance.status = status;
    instance.photoUrl = photoUrl;
    instance.photoPath = photoPath;

    if (parentCategoryId) {
      const parent = new StockItemCategory();
      parent.id = parentCategoryId;
      instance.parentCategory = parent;
    }

    return instance;
  }
}
