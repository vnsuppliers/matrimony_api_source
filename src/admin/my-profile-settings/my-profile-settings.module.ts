import { Module } from '@nestjs/common';
import { MyProfileSettingsService } from './my-profile-settings.service';
import { MyProfileSettingsController } from './my-profile-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MemberEntity } from 'src/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, MemberEntity])
  ],
  providers: [MyProfileSettingsService],
  controllers: [MyProfileSettingsController],
})
export class MyProfileSettingsModule {}
