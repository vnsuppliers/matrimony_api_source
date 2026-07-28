import { Module } from '@nestjs/common';
import { HobbiesManagementService } from './hobbies_management.service';
import { HobbiesManagementController } from './hobbies_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { HobbiesInfoEntity } from 'src/entities/hobbies_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, HobbiesInfoEntity])],
  providers: [HobbiesManagementService],
  controllers: [HobbiesManagementController],
})
export class HobbiesManagementModule {}
