import { Module } from '@nestjs/common';
import { VisitorManagementService } from './visitor_management.service';
import { VisitorManagementController } from './visitor_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { ProfileVisitEntity } from 'src/entities/profile_visttors.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, MemberEntity, ProfileVisitEntity])],
  providers: [VisitorManagementService],
  controllers: [VisitorManagementController],
})
export class VisitorManagementModule {}
