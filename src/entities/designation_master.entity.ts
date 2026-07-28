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
import { ProfessionMasterEntity } from './profession_master.entity';
import { ProfessionInfoEntity } from './profession_info.entity';

@Entity('designation_master')
export class DesignationMasterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  designation_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // MANY DESIGNATIONS -> ONE PROFESSION
  @ManyToOne(() => ProfessionMasterEntity, (p) => p.designations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profession_id' })
  profession: ProfessionMasterEntity;

  @Column({ type: 'int' })
  profession_id: number;

  // ONE DESIGNATION -> MANY PROFESSION INFO
  // Inside DesignationMasterEntity
  @OneToMany(() => ProfessionInfoEntity, (profession) => profession.designation)
  professionInfos: ProfessionInfoEntity[];
}
