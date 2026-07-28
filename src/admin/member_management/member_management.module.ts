import { Module } from '@nestjs/common';
import { MemberManagementService } from './member_management.service';
import { MemberManagementController } from './member_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [MemberManagementService],
  controllers: [MemberManagementController],
})
export class MemberManagementModule {}
