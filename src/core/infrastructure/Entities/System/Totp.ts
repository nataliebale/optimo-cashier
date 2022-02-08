import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Totp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totp: string;

  @Column()
  useDate: Date;
}
