import { Module } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { EducationMasterEntity } from 'src/entities/education_master.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EducationMasterEntity])],
  providers: [EducationService],
  controllers: [EducationController],
})
export class EducationModule {}
