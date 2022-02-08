import { OperatorSession } from './OperatorSession';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { IOperatorPermissions } from '../../../../shared/types/IOperatorPermissions';

@Entity()
export class Operator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  pinCode: string;

  @Column()
  status: number;

  @Column('simple-json', { default: '{}' })
  permissions: IOperatorPermissions;

  @OneToMany((_) => OperatorSession, (op) => op.operator, { nullable: true })
  @JoinTable()
  logins: OperatorSession[];

  public static CreateNew(
    id: number,
    name: string,
    pinCode: string,
    status: number,
    permissions: IOperatorPermissions
  ): Operator {
    const instance = new Operator();
    instance.id = id;
    instance.name = name;
    instance.pinCode = pinCode;
    instance.status = status;
    instance.permissions = permissions;
    return instance;
  }
}
