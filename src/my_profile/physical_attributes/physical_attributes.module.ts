import { Module } from '@nestjs/common';
import { PhysicalAttributesService } from './physical_attributes.service';
import { PhysicalAttributesController } from './physical_attributes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PhysicalAttributesEntity } from 'src/entities/physical_attributes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PhysicalAttributesEntity])],
  providers: [PhysicalAttributesService],
  controllers: [PhysicalAttributesController],
})
export class PhysicalAttributesModule {}
