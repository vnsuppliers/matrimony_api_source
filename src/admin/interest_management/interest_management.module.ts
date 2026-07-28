import { Module } from '@nestjs/common';
import { InterestManagementService } from './interest_management.service';
import { InterestManagementController } from './interest_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { InterestsEntity } from 'src/entities/interests.entity';
import { MemberEntity } from 'src/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, InterestsEntity, MemberEntity])],
  providers: [InterestManagementService],
  controllers: [InterestManagementController],
})
export class InterestManagementModule {}
