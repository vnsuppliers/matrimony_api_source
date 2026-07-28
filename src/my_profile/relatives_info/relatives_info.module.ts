import { Module } from '@nestjs/common';
import { RelativesInfoService } from './relatives_info.service';
import { RelativesInfoController } from './relatives_info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { RelativesInfoEntity } from 'src/entities/relatives_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RelativesInfoEntity])],
  providers: [RelativesInfoService],
  controllers: [RelativesInfoController],
})
export class RelativesInfoModule {}
