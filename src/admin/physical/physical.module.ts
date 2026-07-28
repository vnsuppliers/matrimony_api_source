import { Module } from '@nestjs/common';
import { PhysicalService } from './physical.service';
import { PhysicalController } from './physical.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PhysicalAttributesEntity } from 'src/entities/physical_attributes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PhysicalAttributesEntity])],
  providers: [PhysicalService],
  controllers: [PhysicalController],
})
export class PhysicalModule {}
