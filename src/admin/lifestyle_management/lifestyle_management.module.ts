import { Module } from '@nestjs/common';
import { LifestyleManagementService } from './lifestyle_management.service';
import { LifestyleManagementController } from './lifestyle_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LifestyleInfoEntity } from 'src/entities/lifestyle_info.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, LifestyleInfoEntity])],
  providers: [LifestyleManagementService],
  controllers: [LifestyleManagementController],
})
export class LifestyleManagementModule {}
