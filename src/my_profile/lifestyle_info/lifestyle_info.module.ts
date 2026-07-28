import { Module } from '@nestjs/common';
import { LifestyleInfoService } from './lifestyle_info.service';
import { LifestyleInfoController } from './lifestyle_info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LifestyleInfoEntity } from 'src/entities/lifestyle_info.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LifestyleInfoEntity, User])],
  providers: [LifestyleInfoService],
  controllers: [LifestyleInfoController],
})
export class LifestyleInfoModule {}
