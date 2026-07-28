import { Module } from '@nestjs/common';
import { UserBasicInfoService } from './user_basic_info.service';
import { UserBasicInfoController } from './user_basic_info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MemberEntity } from 'src/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, MemberEntity])],
  providers: [UserBasicInfoService],
  controllers: [UserBasicInfoController],
})
export class UserBasicInfoModule {}
