import { Module } from '@nestjs/common';
import { FamilyInfoService } from './family_info.service';
import { FamilyInfoController } from './family_info.controller';
import { FamilyInfoEntity } from 'src/entities/family_info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyInfoEntity, User])],
  providers: [FamilyInfoService],
  controllers: [FamilyInfoController],
})
export class FamilyInfoModule {}
