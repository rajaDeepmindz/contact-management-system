import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  mobile: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  source: string;

  @Column({ default: 'active' })
  status: string;
}
