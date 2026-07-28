import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CountryMasterEntity } from './country_master.entity';
import { StateMasterEntity } from './state_master.entity';
import { CityMasterEntity } from './city_master.entity';

@Entity('siblings_info')
export class SiblingsInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.siblings_info, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User; // foreign key to the users table

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  date_of_birth: string; // stored as a string in the format 'YYYY-MM-DD'

  @Column({ type: 'varchar', length: 255, nullable: true })
  relation: string; // brother, sister, twins etc.

  @Column({ type: 'int', default: 0 })
  is_elder: number; // 1 for elder, 0 for younger

  @Column({ type: 'varchar', length: 255, nullable: true })
  marital_status: string; // single, married, divorced, widowed etc.

  @Column({ type: 'varchar', length: 255, nullable: true })
  educational_qualification: string; // high school, bachelor's degree, master's degree, etc.

  @Column({ type: 'varchar', length: 255, nullable: true })
  profession: string; // job title or profession

  @Column({ type: 'varchar', length: 255, nullable: true })
  company_name: string; // name of the company where the sibling works.

  @Column({ type: 'varchar', length: 255, nullable: true })
  spouse_name: string; // name of the sibling's spouse, if applicable.

  @Column({ type: 'varchar', length: 255, nullable: true })
  spouse_profession: string; // profession of the sibling's spouse, if applicable.

  @Column({ type: 'varchar', length: 255, nullable: true })
  children_count: string; // number of children the sibling has, if applicable.

  @Column({ type: 'varchar', length: 255, nullable: true })
  additional_notes: string; // any additional information about the sibling.

  @ManyToOne(() => CountryMasterEntity, { nullable: true })
  @JoinColumn({ name: 'country_id' })
  countrymaster: CountryMasterEntity;

  @Column({ type: 'int', nullable: true })
  country_id: number;

  @ManyToOne(() => StateMasterEntity, { nullable: true })
  @JoinColumn({ name: 'state_id' })
  statemaster: StateMasterEntity;

  @Column({ type: 'int', nullable: true })
  state_id: number;

  @ManyToOne(() => CityMasterEntity, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  citymaster: CityMasterEntity;

  @Column({ type: 'int', nullable: true })
  city_id: number;

  @Column({ type: 'int', default: 1 })
  status: number; // 1 for active, 0 for inactive

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({
    type: 'timestamp',
  })
  updated_at: Date;
}
