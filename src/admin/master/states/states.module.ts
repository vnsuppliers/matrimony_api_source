import { Module } from '@nestjs/common';
import { StatesService } from './states.service';
import { StatesController } from './states.controller';
import { StateMasterEntity } from 'src/entities/state_master.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StateMasterEntity])],
  providers: [StatesService],
  controllers: [StatesController],
})
export class StatesModule {}
