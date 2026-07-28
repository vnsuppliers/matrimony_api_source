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
import { EducationMasterEntity } from './education_master.entity';
import { SpecialisationMaster } from './specialisation_master.entity';
import { CountryMasterEntity } from './country_master.entity';
import { StateMasterEntity } from './state_master.entity';
import { CityMasterEntity } from './city_master.entity';

@Entity('education_info')
export class EducationInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.education_info)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'int',
    nullable: false,
  })
  user_id: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  education_id!: number;

  @ManyToOne(() => EducationMasterEntity, (edumaster) => edumaster.education)
  @JoinColumn({ name: 'education_id' })
  edumaster: EducationMasterEntity;

  // FIXED NAME
  @Column({
    type: 'int',
    nullable: true,
  })
  specialisation_id!: number;

  @ManyToOne(
    () => SpecialisationMaster,
    (specialmaster) => specialmaster.education,
  )
  @JoinColumn({ name: 'specialisation_id' })
  specialmaster: SpecialisationMaster;

  @Column({
    type: 'text',
    nullable: true,
  })
  college_name!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  university_name!: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  passing_year!: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  country_id!: number;

  @ManyToOne(
    () => CountryMasterEntity,
    (countryMaster) => countryMaster.education_info,
  )
  @JoinColumn({ name: 'country_id' })
  countryMaster: CountryMasterEntity;

  @Column({
    type: 'int',
    nullable: true,
  })
  state_id!: number;

  @ManyToOne(
    () => StateMasterEntity,
    (statemaster) => statemaster.education_info,
  )
  @JoinColumn({ name: 'state_id' })
  statemaster: StateMasterEntity;

  @Column({
    type: 'int',
    nullable: true,
  })
  city_id!: number;

  @ManyToOne(() => CityMasterEntity, (citymaster) => citymaster.education_info)
  @JoinColumn({ name: 'city_id' })
  citymaster: CityMasterEntity;

  // FIXED NAME
  @Column({
    type: 'text',
    nullable: true,
  })
  education_address!: string;

  @Column({ type: 'int', default: 1 })
  status!: number;

  @Column({ type: 'int', default: null })
  education_info_status: number;

  @Column({ type: 'int', default: 0 })
  is_highest_education: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at!: Date;
}
