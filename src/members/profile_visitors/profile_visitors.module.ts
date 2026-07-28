import { Module } from '@nestjs/common';
import { ProfileVisitorsService } from './profile_visitors.service';
import { ProfileVisitorsController } from './profile_visitors.controller';
import { ProfileVisitEntity } from 'src/entities/profile_visttors.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileVisitEntity, User])],
  providers: [ProfileVisitorsService, AccountStatusGuard],
  controllers: [ProfileVisitorsController],
})
export class ProfileVisitorsModule {}
