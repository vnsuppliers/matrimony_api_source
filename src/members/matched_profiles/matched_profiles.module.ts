import { Module } from '@nestjs/common';
import { MatchedProfilesService } from './matched_profiles.service';
import { MatchedProfilesController } from './matched_profiles.controller';
import { User } from 'src/entities/user.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity, User])],
  providers: [MatchedProfilesService],
  controllers: [MatchedProfilesController],
})
export class MatchedProfilesModule {}
