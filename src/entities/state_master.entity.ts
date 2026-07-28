import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CountryMasterEntity } from './country_master.entity';
import { CityMasterEntity } from './city_master.entity';
import { PresentAddressEntity } from './present_address.entity';
import { EducationInfoEntity } from './education_info.entity';
import { PermanentAddressEntity } from './permanent_address_info.entity';
import { FamilyInfoEntity } from './family_info.entity';

@Entity('states')
export class StateMasterEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @ManyToOne(() => CountryMasterEntity, (country) => country.states)
  @JoinColumn({ name: 'country_id' })
  country!: CountryMasterEntity;

  @OneToMany(() => CityMasterEntity, (city) => city.state)
  cities!: CityMasterEntity[];

  @Column({ type: 'int', default: 1 })
  status: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(
    () => PresentAddressEntity,
    (presentaddres) => presentaddres.statemaster,
  )
  presentaddres: PresentAddressEntity[];

  @OneToMany(
    () => EducationInfoEntity,
    (education_info) => education_info.statemaster,
  )
  education_info: EducationInfoEntity[];

  @OneToMany(
    () => PermanentAddressEntity,
    (permanentaddress) => permanentaddress.statemaster,
  )
  permanentaddress: PermanentAddressEntity[];

  @OneToMany(() => FamilyInfoEntity, (family_info) => family_info.statemaster)
  family_info: FamilyInfoEntity[];
}
