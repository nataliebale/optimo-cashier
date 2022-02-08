import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CashWithdrawal {
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

  public static CreateNew(
    shiftId: number,
    operatorId: number,
    amount: number,
    reason: string,
    withdrawalDate: Date
  ): CashWithdrawal {
    const instance = new CashWithdrawal();
    instance.shiftId = shiftId;
    instance.operatorId = operatorId;
    instance.amount = amount;
    instance.reason = reason;
    instance.withdrawalDate = withdrawalDate;
    return instance;
  }
}
