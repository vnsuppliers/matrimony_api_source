import { Module } from '@nestjs/common';
import { AstronomicInfoService } from './atronomic_info.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AstronomicInfoEntity } from 'src/entities/astronomic_info.entity';
import { AstronomicInfoController } from './atronomic_info.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, AstronomicInfoEntity])],
  providers: [AstronomicInfoService],
  controllers: [AstronomicInfoController],
})
export class AtronomicInfoModule {}
