import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CountryMasterEntity } from './country_master.entity';
import { StateMasterEntity } from './state_master.entity';
import { CityMasterEntity } from './city_master.entity';

@Entity('family_info')
export class FamilyInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.familyInfo)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'varchar', nullable: true })
  father_name: string;

  @Column({ type: 'varchar', nullable: true })
  father_occupation: string;

  @Column({ type: 'varchar', nullable: true })
  father_education: string;

  @Column({ type: 'varchar', nullable: true })
  father_status: string;

  @Column({ type: 'varchar', nullable: true })
  mother_education: string;

  @Column({ type: 'varchar', nullable: true })
  mother_name: string;

  @Column({ type: 'varchar', nullable: true })
  mother_status: string;

  @Column({ type: 'varchar', nullable: true })
  mother_occupation: string;

  @Column({ type: 'varchar', nullable: true })
  family_type: string; // nuclear / joint / extended

  @Column({ type: 'varchar', nullable: true })
  family_values: string; // traditional / moderate / liberal

  @Column({ type: 'int', nullable: true })
  country_id: number;

  @ManyToOne(
    () => CountryMasterEntity,
    (countrymaster) => countrymaster.family_info,
  )
  @JoinColumn({ name: 'country_id' })
  countrymaster: CountryMasterEntity;

  @Column({ type: 'int', nullable: true })
  state_id: number;

  @ManyToOne(() => StateMasterEntity, (statemaster) => statemaster.family_info)
  @JoinColumn({ name: 'state_id' })
  statemaster: StateMasterEntity;

  @Column({ type: 'int', nullable: true })
  city_id: number;

  @ManyToOne(() => CityMasterEntity, (citymaster) => citymaster.family_info)
  @JoinColumn({ name: 'city_id' })
  citymaster: CityMasterEntity;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'int', nullable: true })
  pincode: number;

  @Column({ type: 'int', default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
