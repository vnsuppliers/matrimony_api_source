import { Module } from '@nestjs/common';
import { MotherTongueService } from './mother_tongue.service';
import { MotherTongueController } from './mother_tongue.controller';
import { MotherTongueMasterEntity } from 'src/entities/mother_tongue_master.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MotherTongueMasterEntity])],
  providers: [MotherTongueService],
  controllers: [MotherTongueController],
})
export class MotherTongueModule {}
