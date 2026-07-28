import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('block_profiles')
export class BlockProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  blocker_user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'blocker_user_id' })
  blockerUser: User;

  @Column()
  blocked_user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'blocked_user_id' })
  blockedUser: User;

  @Column({ nullable: true, type: 'text' })
  reason?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  reason_type?: 'harassment' | 'fake_profile' | 'not_interested' | 'other';

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
