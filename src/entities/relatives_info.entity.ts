import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('relatives_info')
export class RelativesInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.relative_info)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  relative_name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  relation: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  occupation: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  location: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  contact_number: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes: string;

  @Column({
    type: 'int',
    default: 1,
  })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
