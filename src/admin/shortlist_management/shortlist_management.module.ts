import { Module } from '@nestjs/common';
import { ShortlistManagementService } from './shortlist_management.service';
import { ShortlistManagementController } from './shortlist_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ShortlistEntity } from 'src/entities/shortlist.entity';
import { MemberEntity } from 'src/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ShortlistEntity, MemberEntity])],
  providers: [ShortlistManagementService],
  controllers: [ShortlistManagementController],
})
export class ShortlistManagementModule {}
