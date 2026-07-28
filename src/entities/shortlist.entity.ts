import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('shortlists')
export class ShortlistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  shortlisted_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'shortlisted_by' })
  shortlisted_by_user: User;

  @Column({ type: 'integer', nullable: false })
  shortlisted_to: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'shortlisted_to' })
  shortlisted_to_user: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
