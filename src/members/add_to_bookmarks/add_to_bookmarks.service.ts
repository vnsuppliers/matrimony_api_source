import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddToBookmarkEntity } from 'src/entities/add_to_bookmarks.entity';
import { NotificationEntity } from 'src/entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddToBookmarksService {
  constructor(
    @InjectRepository(AddToBookmarkEntity)
    private readonly addToBookmarkRepo: Repository<AddToBookmarkEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
  ) {}

  public async add_to_bookmark(sender_id: number, receiver_id: number) {
    // console.log('DEBUG: sender_id:', sender_id, 'receiver_id:', receiver_id);
    if (sender_id === receiver_id) {
      return { success: false, message: 'You cannot bookmark yourself' };
    }

    const exists = await this.addToBookmarkRepo.findOneBy({
      sender_id,
      receiver_id,
    });

    if (exists) {
      return { success: false, message: 'Already bookmarked' };
    }

    //  Save the bookmark
    const bookmark = this.addToBookmarkRepo.create({ sender_id, receiver_id });
    await this.addToBookmarkRepo.save(bookmark);

    // Add notification for the receiver
    await this.notificationRepo.save({
      user: { id: receiver_id }, // The person receiving the alert
      sender: { id: sender_id }, // THE PERSON WHO BOOKMARKED
      title: 'New Bookmark',
      description: 'Someone added you to their bookmarks.',
      type: 'bookmark',
      is_read: false,
    });

    return { success: true, message: 'Bookmarked successfully' };
  }

  public async remove_bookmark(sender_id: number, receiver_id: number) {
    const result = await this.addToBookmarkRepo.delete({
      sender_id,
      receiver_id,
    });

    if (result.affected === 0) {
      return {
        success: false,
        message: 'Bookmark not found',
      };
    }

    return {
      success: true,
      message: 'Removed bookmark',
    };
  }

  public async get_bookmarks(userId: number) {
    return this.addToBookmarkRepo.find({
      where: {
        sender: { id: userId },
      },
      relations: ['receiver'],
    });
  }
}
