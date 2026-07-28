import { Module } from '@nestjs/common';
import { RelativesManagementService } from './relatives_management.service';
import { RelativesManagementController } from './relatives_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { RelativesInfoEntity } from 'src/entities/relatives_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RelativesInfoEntity])],
  providers: [RelativesManagementService],
  controllers: [RelativesManagementController],
})
export class RelativesManagementModule {}
