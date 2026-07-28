// profile_visttors.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/entities/user.entity';

@Entity('profile_visits')
export class ProfileVisitEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  viewer_id: number;

  @Column({ type: 'integer' })
  profile_id: number;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'viewer_id' })
  viewer: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
