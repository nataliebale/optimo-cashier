import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CashWithdrawalLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shiftId: number;

  @Column()
  operatorId: number;

  @Column()
  amount: number;

  @Column()
  reason: string;

  @Column()
  withdrawalDate: Date;
}
