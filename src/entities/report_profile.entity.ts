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

@Entity('report_profiles')
export class ReportProfilesEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // Who is reporting
  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  // Who is being reported
  @ManyToOne(() => User)
  @JoinColumn({ name: 'reported_user_id' })
  reportedUser: User;

  @Column({ type: 'varchar', length: 255 })
  reason: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'pending',
  })
  status: string; // pending | reviewed | rejected | action_taken

  @Column({ type: 'text', nullable: true })
  admin_note?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  action_taken?: string; // banned | warned | no_action

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
