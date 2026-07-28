import { Module } from '@nestjs/common';
import { AddToBookmarksService } from './add_to_bookmarks.service';
import { AddToBookmarksController } from './add_to_bookmarks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddToBookmarkEntity } from 'src/entities/add_to_bookmarks.entity';
import { NotificationEntity } from 'src/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AddToBookmarkEntity, NotificationEntity]),
  ],
  providers: [AddToBookmarksService],
  controllers: [AddToBookmarksController],
})
export class AddToBookmarksModule {}
