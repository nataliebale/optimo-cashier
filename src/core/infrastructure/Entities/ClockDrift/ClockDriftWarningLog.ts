import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClockDriftWarningLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timeShown: Date;

  public static CreateNew(timeShown: Date): ClockDriftWarningLog {
    const instance = new ClockDriftWarningLog();
    instance.timeShown = timeShown;
    return instance;
  }
}
