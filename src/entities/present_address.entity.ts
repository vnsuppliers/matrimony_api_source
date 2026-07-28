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
import { CountryMasterEntity } from './country_master.entity';
import { StateMasterEntity } from './state_master.entity';
import { CityMasterEntity } from './city_master.entity';

@Entity('present_address')
export class PresentAddressEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // FK column
  @Column()
  user_id!: number;

  // relation
  @OneToOne(() => User, (user) => user.present_address, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', nullable: true })
  address_line1: string;

  @Column({ type: 'varchar', nullable: true })
  address_line2: string;

  @Column({ type: 'int', nullable: true })
  country_id?: number;

  @ManyToOne(
    () => CountryMasterEntity,
    (countrymaster) => countrymaster.presentaddres,
  )
  @JoinColumn({ name: 'country_id' })
  countrymaster: CountryMasterEntity;

  @Column({ type: 'int', nullable: true })
  state_id?: number;

  @ManyToOne(
    () => StateMasterEntity,
    (statemaster) => statemaster.presentaddres,
  )
  @JoinColumn({ name: 'state_id' })
  statemaster: StateMasterEntity;

  @Column({ type: 'int', nullable: true })
  city_id?: number;

  @ManyToOne(() => CityMasterEntity, (citymaster) => citymaster.presentaddres)
  @JoinColumn({ name: 'city_id' })
  citymaster: CityMasterEntity;

  @Column({ type: 'int', default: 1 })
  status?: number;

  @Column({ type: 'varchar' })
  pincode?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
