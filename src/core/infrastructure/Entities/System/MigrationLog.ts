import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class MigrationLog {
  @PrimaryColumn()
  name: string;

  public static CreateNew(name: string): MigrationLog {
    const instance = new MigrationLog();
    instance.name = name;
    return instance;
  }
}
