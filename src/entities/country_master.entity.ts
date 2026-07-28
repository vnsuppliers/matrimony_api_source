import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StateMasterEntity } from './state_master.entity';
import { PresentAddressEntity } from './present_address.entity';
import { EducationInfoEntity } from './education_info.entity';
import { PermanentAddressEntity } from './permanent_address_info.entity';
import { FamilyInfoEntity } from './family_info.entity';

@Entity('countries')
export class CountryMasterEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 3, nullable: true })
  phone_code!: string;

  @Column({ length: 10, nullable: true })
  iso3!: string;

  @OneToMany(() => StateMasterEntity, (state) => state.country)
  states!: StateMasterEntity[];

  @Column({ type: 'int', default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @OneToMany(
    () => PresentAddressEntity,
    (presentaddress) => presentaddress.countrymaster,
  )
  presentaddres: CountryMasterEntity[];

  @OneToMany(
    () => PermanentAddressEntity,
    (permanentaddress) => permanentaddress.countrymaster,
  )
  permanentaddress: CountryMasterEntity[];

  @OneToMany(
    () => EducationInfoEntity,
    (education_info) => education_info.countryMaster,
  )
  education_info: EducationInfoEntity[];

  @OneToMany(() => FamilyInfoEntity, (family_info) => family_info.countrymaster)
  family_info: FamilyInfoEntity[];
}
