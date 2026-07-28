import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('lifestyle_info')
export class LifestyleInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // ================= RELATION =================
  @OneToOne(() => User, (user) => user.lifestyleInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  // ================= BASIC HABITS =================
  @Column({ nullable: true })
  diet: string;

  @Column({ nullable: true })
  smoking: string;

  @Column({ nullable: true })
  drinking: string;

  @Column({ nullable: true })
  physical_status: string;

  @Column({ nullable: true })
  fitness_level: string;

  // ================= DAILY ROUTINE =================
  @Column({ nullable: true })
  sleep_habit: string;

  // ================= BODY TYPE =================
  @Column({ nullable: true })
  body_type: string;

  @Column({ nullable: true })
  wake_up_time: string;

  // ================= LIVING =================
  @Column({ nullable: true })
  living_style: string;

  @Column({ nullable: true })
  family_type: string;

  // ================= SOCIAL =================
  @Column({ nullable: true })
  social_habits: string;

  @Column({ nullable: true })
  travel_habits: string;

  @Column({ nullable: true })
  food_habits: string;

  @Column({ nullable: true })
  fashion_style: string;

  // ================= PERSONAL =================
  @Column({ nullable: true })
  pet_preference: string;

  @Column({ nullable: true })
  driving_habit: string;

  @Column({ nullable: true })
  work_life_balance: string;

  @Column({ nullable: true })
  religious_life_style: string;

  // ================= SYSTEM =================
  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
