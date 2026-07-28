import { Module } from '@nestjs/common';
import { ApproveSuccessStoryService } from './approve_success_story.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SuccessStoryEntity } from 'src/entities/success_story.entity';
import { ApproveSuccessStoryController } from './approve_success_story.controller';
import { RatingEntity } from 'src/entities/ratings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SuccessStoryEntity, RatingEntity])],
  providers: [ApproveSuccessStoryService],
  controllers: [ApproveSuccessStoryController],
})
export class ApproveSuccessStoryModule {}
