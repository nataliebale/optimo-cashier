import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ICashWithdrawal } from '../../../../shared/types/ICashWithdrawal';
import { IOperator } from '../../../../shared/types/IOperator';

@Entity()
export class Shift {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  startOperatorId: number;

  @Column({ nullable: true })
  endOperatorId?: number;

  @Column()
  cashBegin: number;

  @Column({ nullable: true })
  cashEnd?: number;

  @Column()
  dateBegin: Date;

  @Column({ nullable: true })
  dateEnd?: Date;

  @Column()
  finished: boolean;

  /**
   * @deprecated Use CashWithdrawal Entity
   */
  @Column('simple-json', { nullable: true })
  withdrawals: ICashWithdrawal[];

  public static CreateNew(operatorId: number, cashBegin: number, dateBegin: Date): Shift {
    const instance = new Shift();
    instance.startOperatorId = operatorId;
    instance.cashBegin = cashBegin;
    instance.dateBegin = dateBegin;
    return instance;
  }

  public endShift(operatorId: number, cashEnd: number, dateEnd: Date): Shift {
    this.endOperatorId = operatorId;
    this.cashEnd = cashEnd;
    this.dateEnd = dateEnd;
    this.finished = true;
    return this;
  }
}
