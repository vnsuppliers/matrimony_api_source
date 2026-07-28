import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';
import { GalleryEntity } from 'src/entities/gallery.entity';
import { GalleryDto } from 'src/dto/gallery.dto';

@Injectable()
export class ProfileGalleryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(GalleryEntity)
    private readonly galleryRepo: Repository<GalleryEntity>,
  ) {}

  // ==========================================
  //  GET METHOD: Extracts clean data maps
  // ==========================================
  public async get_gallery(user_id: number) {
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    if (!user) throw new NotFoundException('User not found');

    const records = await this.galleryRepo.find({
      where: { user_id },
      order: { id: 'DESC' },
    });

    return records.map((record) => {
      let cleanFilename = '';

      // Force conversion to a plain text string, removing any JSON quotes/brackets if they exist
      if (record.gallery_images) {
        const raw = String(record.gallery_images);
        cleanFilename = raw.replace(/[[\]"]/g, '');
      }

      return {
        id: record.id,
        user_id: record.user_id,
        image_url: record.image_url,
        status: record.status,
        created_at: record.created_at,
        updated_at: record.updated_at,
        // Send down to front-end as a single clean string parameter
        gallery_images: cleanFilename || null,
      };
    });
  }

  // ==========================================
  //  CREATE METHOD: Saves one file per row as a string
  // ==========================================
  public async update_create(
    user_id: number,
    dto: GalleryDto,
    files?: Express.Multer.File[],
  ) {
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    if (!user) throw new NotFoundException('User not found');

    const createdRecords = [];

    //  Save external web image URLs
    if (dto.image_url && dto.image_url.trim().length > 0) {
      const record = this.galleryRepo.create({
        user_id,
        image_url: dto.image_url.trim(),
        gallery_images: '' as unknown as string,
        status: dto.status ?? 0,
      });
      createdRecords.push(await this.galleryRepo.save(record));
    }

    // Loop through files and save EACH file to its own unique row as a single string
    // Inside your update_create method where you save the file:
    if (files && files.length > 0) {
      for (const file of files) {
        const record = this.galleryRepo.create({
          user_id,
          image_url: null,
          // Stringify directly to match the string type on the entity while writing valid JSON to the DB!
          gallery_images: JSON.stringify([file.filename]),
          status: dto.status ?? 0,
        });
        createdRecords.push(await this.galleryRepo.save(record));
      }
    }

    if (createdRecords.length === 0) {
      throw new BadRequestException(
        'A valid image URL or file upload is required.',
      );
    }

    return {
      message: `${createdRecords.length} image item(s) saved successfully.`,
      status: true,
    };
  }

  // ==========================================
  //  DELETE METHOD: Performs a real SQL DELETE
  // ==========================================
  public async delete_gallery_item(user_id: number, id: number) {
    const record = await this.galleryRepo.findOne({ where: { id, user_id } });
    if (!record) {
      throw new NotFoundException('Gallery image record not found');
    }

    await this.galleryRepo.delete({ id });

    return {
      message: 'Image removed from database permanently.',
      status: true,
    };
  }

  // ==========================================
  //  TOGGLE VISIBILITY STATUS METHOD (NEW)
  // ==========================================
  public async toggle_status(user_id: number, id: number, status: number) {
    const record = await this.galleryRepo.findOne({ where: { id, user_id } });
    if (!record) {
      throw new NotFoundException('Gallery image record not found');
    }

    // Pure status column update operation
    await this.galleryRepo.update({ id }, { status });

    return {
      message: `Visibility status updated to ${status === 1 ? 'Visible' : 'Hidden'} successfully.`,
      status: true,
    };
  }
}
