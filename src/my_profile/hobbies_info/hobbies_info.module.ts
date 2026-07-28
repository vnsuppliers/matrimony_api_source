import { Module } from '@nestjs/common';
import { HobbiesInfoService } from './hobbies_info.service';
import { HobbiesInfoController } from './hobbies_info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { HobbiesInfoEntity } from 'src/entities/hobbies_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, HobbiesInfoEntity])],
  providers: [HobbiesInfoService],
  controllers: [HobbiesInfoController],
})
export class HobbiesInfoModule {}
