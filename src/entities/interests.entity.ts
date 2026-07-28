import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';

@Entity('interests')
export class InterestsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  interested_by: number;

  @Column({ type: 'integer' })
  interested_to: number;

  @Column({ type: 'int', nullable: true })
  rejected_by: number;

  @ManyToOne(() => User, (user) => user.sent_interests)
  @JoinColumn({ name: 'interested_by' })
  by: User;

  @ManyToOne(() => User, (user) => user.received_interests)
  @JoinColumn({ name: 'interested_to' })
  to: User;

  @Column({ type: 'text', nullable: false })
  reason: string;

  @Column({ type: 'integer', default: 0 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
