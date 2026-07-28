import { Module } from '@nestjs/common';
import { ProfessionMasterService } from './profession_master.service';
import { ProfessionMasterController } from './profession_master.controller';
import { ProfessionMasterEntity } from 'src/entities/profession_master.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionMasterEntity])],
  providers: [ProfessionMasterService],
  controllers: [ProfessionMasterController],
})
export class ProfessionMasterModule {}
