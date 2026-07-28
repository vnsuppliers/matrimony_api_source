import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GalleryEntity } from 'src/entities/gallery.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MemberGalleryService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(GalleryEntity)
    private readonly galleryRepo: Repository<GalleryEntity>,
  ) {}

  public async get_gallery_images(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User not found ID: ${userId}`);
    }

    // CRITICAL FIX: Only retrieve images where status is explicitly equal to 1 (Visible)
    const records = await this.galleryRepo.find({
      where: {
        user_id: userId,
        status: 1,
      },
      order: { id: 'DESC' },
    });

    // Clean filenames to match the safe text parsing structure expected by your UI layouts
    return records.map((record) => {
      let cleanFilename = '';

      if (record.gallery_images) {
        const raw = String(record.gallery_images);
        cleanFilename = raw.replace(/[[\]"]/g, '');
      }

      return {
        ...record,
        gallery_images: cleanFilename || null,
      };
    });
  }
}
