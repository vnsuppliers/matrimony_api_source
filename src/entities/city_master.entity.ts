import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { StateMasterEntity } from './state_master.entity';
import { PresentAddressEntity } from './present_address.entity';
import { EducationInfoEntity } from './education_info.entity';
import { PermanentAddressEntity } from './permanent_address_info.entity';
import { FamilyInfoEntity } from './family_info.entity';

@Entity('cities')
export class CityMasterEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Index('idx_city_state_id', ['state'])
  @ManyToOne(() => StateMasterEntity, (state) => state.cities)
  @JoinColumn({ name: 'state_id' })
  state!: StateMasterEntity;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
  @OneToMany(
    () => PresentAddressEntity,
    (presentaddres) => presentaddres.citymaster,
  )
  presentaddres: CityMasterEntity[];

  @OneToMany(
    () => EducationInfoEntity,
    (education_info) => education_info.citymaster,
  )
  education_info: EducationInfoEntity[];

  @OneToMany(
    () => PermanentAddressEntity,
    (permanentaddress) => permanentaddress.citymaster,
  )
  permanentaddress: PermanentAddressEntity[];

  @OneToMany(() => FamilyInfoEntity, (family_info) => family_info.citymaster)
  family_info: FamilyInfoEntity[];
}
