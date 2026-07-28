import { Module } from '@nestjs/common';
import { EducationInfoService } from './education_info.service';
import { EducationInfoController } from './education_info.controller';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationInfoEntity } from 'src/entities/education_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EducationInfoEntity, User])],
  providers: [EducationInfoService],
  controllers: [EducationInfoController],
})
export class EducationInfoModule {}
