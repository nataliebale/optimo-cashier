import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ISettings } from '../../../../shared/types/ISettings';

@Entity()
export class SettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-json')
  value: ISettings;
}
