import { Module } from '@nestjs/common';
import { SiblingManagementService } from './sibling_management.service';
import { SiblingManagementController } from './sibling_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SiblingsInfoEntity } from 'src/entities/siblings_info_entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SiblingsInfoEntity])],
  providers: [SiblingManagementService],
  controllers: [SiblingManagementController],
})
export class SiblingManagementModule {}
