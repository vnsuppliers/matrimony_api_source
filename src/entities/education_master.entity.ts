import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Entity,
} from 'typeorm';
import { SpecialisationMaster } from './specialisation_master.entity';
import { EducationInfoEntity } from './education_info.entity';

@Entity('education_master')
export class EducationMasterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // RELATION: One education has many specialisations
  @OneToMany(() => SpecialisationMaster, (spec) => spec.education)
  specialisations: SpecialisationMaster[];

  @OneToMany(() => EducationInfoEntity, (education) => education.edumaster)
  education: EducationInfoEntity[];
}
