import { Module } from '@nestjs/common';
import { SpecialisationService } from './specialisation.service';
import { SpecialisationController } from './specialisation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialisationMaster } from 'src/entities/specialisation_master.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialisationMaster])],
  providers: [SpecialisationService],
  controllers: [SpecialisationController],
})
export class SpecialisationModule {}
