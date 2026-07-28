import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { SharedController } from './shared.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { RatingEntity } from 'src/entities/ratings.entity';
import { SuccessStoryEntity } from 'src/entities/success_story.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, MemberEntity, RatingEntity, SuccessStoryEntity])],
  providers: [SharedService],
  controllers: [SharedController],
})
export class SharedModule {}
