import { Module } from '@nestjs/common';
import { AstroManagementService } from './astro_management.service';
import { AstroManagementController } from './astro_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AstronomicInfoEntity } from 'src/entities/astronomic_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AstronomicInfoEntity])],
  providers: [AstroManagementService],
  controllers: [AstroManagementController],
})
export class AstroManagementModule {}
