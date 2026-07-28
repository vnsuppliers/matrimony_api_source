import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { StateMasterEntity } from 'src/entities/state_master.entity';
import { CityMasterEntity } from 'src/entities/city_master.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CityMasterEntity, StateMasterEntity])],
  providers: [CitiesService],
  controllers: [CitiesController],
})
export class CitiesModule {}
