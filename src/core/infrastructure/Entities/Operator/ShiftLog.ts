import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ICashWithdrawal } from '../../../../shared/types/ICashWithdrawal';
import { IOperator } from '../../../../shared/types/IOperator';

@Entity()
export class ShiftLog {
  @PrimaryColumn()
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

  @Column('simple-json', { nullable: true })
  withdrawals: ICashWithdrawal[];

  operator: IOperator;
}
