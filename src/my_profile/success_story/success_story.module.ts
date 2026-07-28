import { Module } from '@nestjs/common';
import { SuccessStoryService } from './success_story.service';
import { SuccessStoryController } from './success_story.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SuccessStoryEntity } from 'src/entities/success_story.entity';
import { RatingEntity } from 'src/entities/ratings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SuccessStoryEntity, RatingEntity])],
  providers: [SuccessStoryService],
  controllers: [SuccessStoryController],
})
export class SuccessStoryModule {}
