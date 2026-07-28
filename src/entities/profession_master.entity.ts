import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DesignationMasterEntity } from './designation_master.entity';
import { ProfessionInfoEntity } from './profession_info.entity';

@Entity('profession_master')
export class ProfessionMasterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  profession_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // ONE PROFESSION -> MANY DESIGNATIONS
  @OneToMany(() => DesignationMasterEntity, (d) => d.profession)
  designations: DesignationMasterEntity[];

  @OneToMany(
    () => ProfessionInfoEntity,
    (professionInfo) => professionInfo.profession,
  )
  profession_info: ProfessionInfoEntity[];
}
