import { Module } from '@nestjs/common';
import { ProfessionInfoService } from './profession_info.service';
import { ProfessionInfoController } from './profession_info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionInfoEntity } from 'src/entities/profession_info.entity';
import { ProfessionMasterEntity } from 'src/entities/profession_master.entity';
import { DesignationMasterEntity } from 'src/entities/designation_master.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ProfessionInfoEntity,
      ProfessionMasterEntity,
      DesignationMasterEntity,
    ]),
  ],
  providers: [ProfessionInfoService],
  controllers: [ProfessionInfoController],
})
export class ProfessionInfoModule {}
