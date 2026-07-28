import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm';
import { EducationMasterEntity } from './education_master.entity';

@Entity('specialisation_master')
export class SpecialisationMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // RELATION: Many specialisations belong to one education
  @ManyToOne(
    () => EducationMasterEntity,
    (education) => education.specialisations,
    { onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'education_id' })
  education: EducationMasterEntity;

  // optional: keep raw FK if you still want it
  @Column({ type: 'bigint' })
  education_id: number;
}
