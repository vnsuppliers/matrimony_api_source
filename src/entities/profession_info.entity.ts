import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfessionMasterEntity } from './profession_master.entity';
import { DesignationMasterEntity } from './designation_master.entity';
import { User } from './user.entity';
import { CountryMasterEntity } from './country_master.entity';
import { StateMasterEntity } from './state_master.entity';
import { CityMasterEntity } from './city_master.entity';

@Entity('profession_info')
export class ProfessionInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.professionInfos)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  profession_id: number;

  @ManyToOne(
    () => ProfessionMasterEntity,
    (profession) => profession.profession_info,
  )
  @JoinColumn({ name: 'profession_id' })
  profession: ProfessionMasterEntity;

  @Column({ nullable: true })
  designation_id?: number;

  @ManyToOne(() => DesignationMasterEntity, (d) => d.professionInfos, {
    nullable: true,
  })
  @JoinColumn({ name: 'designation_id' })
  designation?: DesignationMasterEntity;

  @Column({ nullable: true })
  company_name?: string;

  @Column({ nullable: true })
  experience?: string;

  @Column({ nullable: true })
  income?: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  country_id!: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  state_id!: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  city_id!: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  location: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => CountryMasterEntity, { nullable: true })
  @JoinColumn({ name: 'country_id' })
  country: CountryMasterEntity;

  @ManyToOne(() => StateMasterEntity, { nullable: true })
  @JoinColumn({ name: 'state_id' })
  state: StateMasterEntity;

  @ManyToOne(() => CityMasterEntity, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: CityMasterEntity;
}
