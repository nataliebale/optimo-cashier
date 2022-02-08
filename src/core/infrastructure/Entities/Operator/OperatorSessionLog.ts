import { Operator } from './Operator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class OperatorSessionLog {
  @PrimaryColumn()
  id?: string;

  @Column()
  loginDate: Date;

  @Column()
  logoutDate?: Date;

  @ManyToOne((_) => Operator, (op) => op.logins, { nullable: true })
  operator?: Operator;
}
