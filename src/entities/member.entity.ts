import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { MotherTongueMasterEntity } from './mother_tongue_master.entity';
import { ReligionMasterEntity } from './religion_master.entity';
import { GenderEntity } from './gender.entity';

@Entity('members')
export class MemberEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  user_id!: number;
  @ManyToOne(() => User, (user) => user.members)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 20, unique: true })
  member_id!: string;

  @Column({ type: 'int', nullable: true })
  gender_id!: number;

  @ManyToOne(() => GenderEntity, (gender) => gender.members)
  @JoinColumn({ name: 'gender_id' })
  gender: GenderEntity;

  @Column({ type: 'date', nullable: true })
  date_of_birth?: Date;

  @Column({ nullable: true })
  religion_id?: number;

  @ManyToOne(() => ReligionMasterEntity, (religion) => religion.members)
  @JoinColumn({ name: 'religion_id' })
  religion_master: ReligionMasterEntity;

  @OneToOne(() => MotherTongueMasterEntity, (motherTongue) => motherTongue.id)
  @JoinColumn({ name: 'mother_tongue_id' })
  motherTongue?: MotherTongueMasterEntity;
  @Column({ type: 'int', nullable: true })
  mother_tongue_id?: number;

  @Column({ type: 'text', nullable: true })
  about?: string;

  @Column({ type: 'text', nullable: true })
  profile_image?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  caste: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sub_caste: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  deleted_at?: Date | null;
}
