import { Module } from '@nestjs/common';
import { DesignationMasterService } from './designation_master.service';
import { DesignationMasterController } from './designation_master.controller';
import { DesignationMasterEntity } from 'src/entities/designation_master.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// 1. Import the related entity
import { ProfessionInfoEntity } from 'src/entities/profession_info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DesignationMasterEntity, ProfessionInfoEntity]),
  ],
  providers: [DesignationMasterService],
  controllers: [DesignationMasterController],
})
export class DesignationMasterModule {}
