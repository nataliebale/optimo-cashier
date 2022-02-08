import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Table } from './Table';
import { ISpace } from '../../../../shared/types/ISpace';

@Entity()
export class Space {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  status: number;

  @OneToMany((type) => Table, (table) => table.space)
  tables: Table[];

  public static CreateNew(id: number, name: string, status: number, tables: Table[]): Space {
    const instance = new Space();
    instance.id = id;
    instance.name = name;
    instance.status = status;
    instance.tables = tables;
    return instance;
  }
}
