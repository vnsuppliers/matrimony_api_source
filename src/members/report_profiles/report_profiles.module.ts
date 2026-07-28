import { Module } from '@nestjs/common';
import { ReportProfilesController } from './report_profiles.controller';
import { ReportProfilesService } from './report_profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportProfilesEntity } from 'src/entities/report_profile.entity';
import { NotificationEntity } from 'src/entities/notification.entity';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';
import { User } from 'src/entities/user.entity';
import { ProfileVisitEntity } from 'src/entities/profile_visttors.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportProfilesEntity, NotificationEntity, User, ProfileVisitEntity]),
  ],
  controllers: [ReportProfilesController],
  providers: [ReportProfilesService, AccountStatusGuard],
})
export class ReportProfilesModule {}
