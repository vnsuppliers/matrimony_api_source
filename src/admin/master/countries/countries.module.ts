import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { CountryMasterEntity } from 'src/entities/country_master.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CountryMasterEntity])],
  providers: [CountriesService],
  controllers: [CountriesController],
})
export class CountriesModule {}
