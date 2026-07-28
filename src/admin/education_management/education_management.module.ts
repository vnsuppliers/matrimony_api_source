import { Module } from '@nestjs/common';
import { EducationManagementService } from './education_management.service';
import { EducationManagementController } from './education_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { EducationInfoEntity } from 'src/entities/education_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, EducationInfoEntity])],
  providers: [EducationManagementService],
  controllers: [EducationManagementController],
})
export class EducationManagementModule {}
