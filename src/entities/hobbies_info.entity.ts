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

@Entity('hobbies_info')
export class HobbiesInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // ================= RELATION =================
  @ManyToOne(() => User, (user) => user.hobbies_info, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int' })
  user_id: number;

  // ================= HOBBIES =================
  @Column({ type: 'varchar', nullable: true })
  hobbies: string;

  @Column({ type: 'varchar', nullable: true })
  interests: string;

  @Column({ type: 'varchar', nullable: true })
  favorite_music: string;

  @Column({ type: 'varchar', nullable: true })
  favorite_movies: string;

  @Column({ type: 'varchar', nullable: true })
  favorite_books: string;

  @Column({ type: 'varchar', nullable: true })
  sports: string;

  @Column({ type: 'varchar', nullable: true })
  activities: string;

  @Column({ type: 'varchar', nullable: true })
  languages_known: string;

  @Column({ type: 'varchar', nullable: true })
  entertainment_preferences: string;

  @Column({ type: 'varchar', nullable: true })
  travel_interests: string;

  // ================= SYSTEM =================
  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
