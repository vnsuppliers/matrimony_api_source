import { Module } from '@nestjs/common';
import { ReligiousInfoService } from './religious_info.service';
import { ReligiousInfoController } from './religious_info.controller';
import { MemberEntity } from 'src/entities/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  providers: [ReligiousInfoService],
  controllers: [ReligiousInfoController],
})
export class ReligiousInfoModule {}
