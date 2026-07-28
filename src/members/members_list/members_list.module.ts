import { Module } from '@nestjs/common';
import { MembersListService } from './members_list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { MembersListController } from './members_list.controller';
import { BlockProfileEntity } from 'src/entities/block_profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, MemberEntity, BlockProfileEntity])],
  providers: [MembersListService],
  controllers: [MembersListController],
})
export class MembersListModule {}
