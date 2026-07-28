import { Module } from '@nestjs/common';
import { GenderService } from './gender.service';
import { GenderController } from './gender.controller';
import { GenderEntity } from 'src/entities/gender.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GenderEntity])],
  providers: [GenderService],
  controllers: [GenderController],
})
export class GenderModule {}
