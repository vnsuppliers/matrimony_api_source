import { Module } from '@nestjs/common';
import { ProfessionManagementService } from './profession_management.service';
import { ProfessionManagementController } from './profession_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ProfessionInfoEntity } from 'src/entities/profession_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProfessionInfoEntity])],
  providers: [ProfessionManagementService],
  controllers: [ProfessionManagementController],
})
export class ProfessionManagementModule {}
