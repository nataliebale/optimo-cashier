import { Operator } from './Operator';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { CommonFunctions } from '../../../../shared/CommonFunctions';

@Entity()
export class OperatorSession {
  @PrimaryColumn()
  id: string;

  @Column()
  loginDate: Date;

  @Column({ nullable: true })
  logoutDate?: Date;

  @ManyToOne((_) => Operator, (op) => op.logins, { nullable: true })
  operator?: Operator;

  public static CreateNew(loginDate: Date, operatorId: number): OperatorSession {
    const instance = new OperatorSession();
    const operator = new Operator();
    operator.id = operatorId;
    instance.id = CommonFunctions.generateGuid();
    instance.operator = operator;
    instance.loginDate = loginDate;
    return instance;
  }
}
