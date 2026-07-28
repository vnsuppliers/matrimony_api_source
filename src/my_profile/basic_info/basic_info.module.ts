import { Module } from '@nestjs/common';
import { BasicInfoService } from './basic_info.service';
import { BasicInfoController } from './basic_info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from 'src/entities/member.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity, User])],
  providers: [BasicInfoService],
  controllers: [BasicInfoController],
  exports: [BasicInfoService],
})
export class BasicInfoModule {}
