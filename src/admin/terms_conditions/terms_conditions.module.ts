import { Module } from '@nestjs/common';
import { TermsConditionsService } from './terms_conditions.service';
import { TermsConditionsController } from './terms_conditions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermsConditionsEntity } from 'src/entities/terms_conditions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TermsConditionsEntity])],
  providers: [TermsConditionsService],
  controllers: [TermsConditionsController]
})
export class TermsConditionsModule {}
