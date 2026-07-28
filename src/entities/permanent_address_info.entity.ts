import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { CountryMasterEntity } from './country_master.entity';
import { StateMasterEntity } from './state_master.entity';
import { CityMasterEntity } from './city_master.entity';

@Entity('permanent_address')
export class PermanentAddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @OneToOne(() => User, (user) => user.permanent_address, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: true })
  country_id: number;

  @ManyToOne(
    () => CountryMasterEntity,
    (countrymaster) => countrymaster.permanentaddress,
  )
  @JoinColumn({ name: 'country_id' })
  countrymaster: CountryMasterEntity;

  @Column({ type: 'int', nullable: true })
  state_id: number;

  @ManyToOne(
    () => StateMasterEntity,
    (statemaster) => statemaster.permanentaddress,
  )
  @JoinColumn({ name: 'state_id' })
  statemaster: StateMasterEntity;

  @Column({ type: 'int', nullable: true })
  city_id: number;

  @ManyToOne(
    () => CityMasterEntity,
    (citymaster) => citymaster.permanentaddress,
  )
  @JoinColumn({ name: 'city_id' })
  citymaster: CityMasterEntity;

  @Column({ type: 'text', nullable: true })
  address_line1: string;

  @Column({ type: 'text', nullable: true })
  address_line2: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  pincode: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;
}
