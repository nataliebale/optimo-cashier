import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ShiftAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  actionType: ShiftActionType;

  @Column()
  shiftId: number;

  @Column()
  operatorId: number;

  @Column()
  cash: number;

  @Column()
  date: Date;

  public static CreateNew(
    actionType: ShiftActionType,
    shiftId: number,
    operatorId: number,
    cash: number,
    date: Date
  ) {
    const instance = new ShiftAction();
    instance.actionType = actionType;
    instance.shiftId = shiftId;
    instance.operatorId = operatorId;
    instance.cash = cash;
    instance.date = date;
    return instance;
  }
}


export enum ShiftActionType {
  Start = 1,
  End = 2
}
