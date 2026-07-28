import { Module } from '@nestjs/common';
import { SiblingsInfoService } from './siblings_info.service';
import { SiblingsInfoController } from './siblings_info.controller';
import { SiblingsInfoEntity as SiblingsInfoEntity } from 'src/entities/siblings_info_entity';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SiblingsInfoEntity, User])],
  providers: [SiblingsInfoService],
  controllers: [SiblingsInfoController],
})
export class SiblingsInfoModule {}
