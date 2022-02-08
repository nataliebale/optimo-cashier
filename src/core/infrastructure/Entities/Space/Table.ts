import { Column, Entity, PrimaryColumn, ManyToOne, BaseEntity } from 'typeorm';
import { ITableArrangement } from '../../../../shared/types/ITable';
import { Space } from './Space';

@Entity()
export class Table {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  status: number;

  @ManyToOne((type) => Space, (space) => space.tables)
  space: Space;

  @Column('simple-json', { nullable: true })
  arrangement: ITableArrangement;

  public static CreateNew(
    id: number,
    name: string,
    status: number,
    space: Space,
    arrangement: ITableArrangement
  ): Table {
    const instance = new Table();
    instance.id = id;
    instance.name = name;
    instance.status = status;
    instance.space = space;
    instance.arrangement = arrangement;
    return instance;
  }
}
