import { Module } from '@nestjs/common';
import { ReligionService } from './religion.service';
import { ReligionController } from './religion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReligionMasterEntity } from 'src/entities/religion_master.entity';
import { MemberEntity } from 'src/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReligionMasterEntity, MemberEntity])],
  providers: [ReligionService],
  controllers: [ReligionController],
})
export class ReligionModule {}
