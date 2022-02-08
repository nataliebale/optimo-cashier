import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ICheckItem } from '../../../../shared/types/ICheckItem';
import { IEntityOrderDetails } from '../../../../shared/types/IEntityOrderDetails';

@Entity()
export class Check {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  creationDate?: Date;

  @Column()
  operatorId: number;

  @Column()
  shiftId: number;

  @Column({ nullable: true })
  tableId?: number;

  @Column({ nullable: true })
  guestCount?: number;

  @Column('simple-json')
  products: ICheckItem[];

  @Column('simple-json', { nullable: true })
  legalEntityData?: IEntityOrderDetails;

  @Column()
  basketTotalPrice: number;

  @Column({ default: 0 })
  taxRate: number;

  @Column({ default: 0 })
  taxAmount: number;

  @Column()
  totalPrice: number;

  @Column({ nullable: true })
  orderId?: string;

  public static CreateNew(
    orderId: string,
    operatorId: number,
    shiftId: number,
    taxRate: number,
    tableId?: number,
    guestCount?: number
  ): Check {
    const instance = new Check();
    instance.orderId = orderId;
    instance.creationDate = new Date();
    instance.operatorId = operatorId;
    instance.shiftId = shiftId;
    instance.tableId = tableId;
    instance.guestCount = guestCount;
    instance.products = [];
    instance.taxRate = taxRate;
    instance.taxAmount = 0;
    instance.basketTotalPrice = 0;
    instance.totalPrice = 0;

    return instance;
  }
}
