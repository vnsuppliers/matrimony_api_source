import { Module } from '@nestjs/common';
import { BlockManagementService } from './block_management.service';
import { BlockManagementController } from './block_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { BlockProfileEntity } from 'src/entities/block_profile.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BlockProfileEntity, MemberEntity]),
    EmailModule,
  ],
  providers: [BlockManagementService],
  controllers: [BlockManagementController],
})
export class BlockManagementModule {}
