import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class OperatorSessionAction {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  actionType: OperatorSessionActionType;

  @Column()
  sessionId: string;

  @Column()
  date: Date;

  @Column()
  operatorId: number;

  public static CreateNew(
    actionType: OperatorSessionActionType,
    sessionId: string,
    date: Date,
    operatorId: number
  ): OperatorSessionAction {
    const instance = new OperatorSessionAction();
    instance.actionType = actionType;
    instance.sessionId = sessionId;
    instance.date = date;
    instance.operatorId = operatorId;
    return instance;
  }
}

export enum OperatorSessionActionType {
  Login = 1,
  Logout = 2,
}
