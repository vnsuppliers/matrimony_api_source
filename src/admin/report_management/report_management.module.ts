import { Module } from '@nestjs/common';
import { ReportManagementService } from './report_management.service';
import { ReportManagementController } from './report_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ReportProfilesEntity } from 'src/entities/report_profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ReportProfilesEntity])],
  providers: [ReportManagementService],
  controllers: [ReportManagementController],
})
export class ReportManagementModule {}
