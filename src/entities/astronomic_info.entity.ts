import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('astronomic_info')
export class AstronomicInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @OneToOne(() => User, (user) => user.astro)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 1 = Aries, 2 = Taurus etc (or master table id)
  @Column({ type: 'int', nullable: true })
  zodiac_sign: number;

  // Moon sign (should NOT be int)
  @Column({ type: 'varchar', nullable: true })
  moon_sign: string;

  // Nakshatra padam
  @Column({ type: 'varchar', nullable: true })
  padam: string;

  // Place of birth (city name or text)
  @Column({ type: 'varchar', length: 255, nullable: true })
  place_of_birth: string;

  // Time of birth
  @Column({ type: 'varchar', nullable: true })
  time_of_birth: string;

  // Gotram (string, NOT int)
  @Column({ type: 'varchar', length: 100, nullable: true })
  gothram: string;

  // Notes
  @Column({ type: 'text', nullable: true })
  astro_notes: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
