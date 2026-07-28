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

@Entity('physical_attributes')
export class PhysicalAttributesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ================= RELATION =================
  @OneToOne(() => User, (user) => user.physical_attributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ nullable: true })
  height: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  body_type: string;

  @Column({ nullable: true })
  complexion: string;

  @Column({ nullable: true })
  physical_status: string;

  @Column({ nullable: true })
  blood_group: string;

  @Column({ nullable: true })
  eye_color: string;

  @Column({ nullable: true })
  hair_color: string;

  @Column({ nullable: true })
  hair_type: string;

  @Column({ nullable: true })
  hair_length: string;

  @Column({ nullable: true })
  skin_tone: string;

  @Column({ nullable: true })
  fitness_level: string;

  @Column({ nullable: true })
  disability: string;

  @Column({ type: 'text', nullable: true })
  disability_details: string;

  @Column({ nullable: true })
  spectacles: string;

  @Column({ nullable: true })
  lens_usage: string;

  @Column({ nullable: true })
  beard_style: string;

  @Column({ nullable: true })
  tattoo: string;

  @Column({ nullable: true })
  physique: string;

  @Column({ nullable: true })
  shoe_size: string;

  @Column({ nullable: true })
  dress_size: string;

  @Column({ nullable: true })
  health_condition: string;

  @Column({ type: 'text', nullable: true })
  medical_conditions: string;

  @Column({ type: 'text', nullable: true })
  genetic_disorders: string;

  @Column({ type: 'text', nullable: true })
  appearance_notes: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
