import { Module } from '@nestjs/common';
import { FamilyManagementService } from './family_management.service';
import { FamilyManagementController } from './family_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { FamilyInfoEntity } from 'src/entities/family_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FamilyInfoEntity])],
  providers: [FamilyManagementService],
  controllers: [FamilyManagementController],
})
export class FamilyManagementModule {}
