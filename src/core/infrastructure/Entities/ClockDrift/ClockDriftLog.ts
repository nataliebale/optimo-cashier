import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClockDriftLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  localTime: Date;

  @Column()
  realTime: Date;

  public static CreateNew(localTime: Date, realTime: Date): ClockDriftLog {
    const instance = new ClockDriftLog();
    instance.localTime = localTime;
    instance.realTime = realTime;
    return instance;
  }
}
