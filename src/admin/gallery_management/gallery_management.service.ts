import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GalleryEntity } from 'src/entities/gallery.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { GalleryDto } from 'src/dto/gallery.dto';

@Injectable()
export class GalleryManagementService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(GalleryEntity)
    private readonly galleryRepo: Repository<GalleryEntity>,
  ) {}

  // ==========================================
  //  GET METHOD: Fetch all assets for target user
  // ==========================================
  public async get_user_gallery(targetUserId: number) {
    const user = await this.userRepo.findOne({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException(`User not found with ID: ${targetUserId}`);
    }

    const records = await this.galleryRepo.find({
      where: { user_id: targetUserId },
      order: { id: 'DESC' },
    });

    return records.map((record) => {
      let cleanFilename = '';

      if (record.gallery_images) {
        const raw = String(record.gallery_images);
        cleanFilename = raw.replace(/[[\]"]/g, ''); // Lint-safe text extraction regex
      }

      return {
        ...record,
        gallery_images: cleanFilename || null,
      };
    });
  }

  // ==========================================
  //  CREATE / UPDATE METHOD (Saves 1 image per row)
  // ==========================================
  public async update_create(
    targetUserId: number,
    dto: GalleryDto,
    files?: Express.Multer.File[],
  ) {
    const user = await this.userRepo.findOne({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException(`User not found with ID: ${targetUserId}`);
    }

    const createdRecords = [];
    const statusValue = dto.status !== undefined ? Number(dto.status) : 1;

    // Explicitly cast to clean object mapping to guarantee safe ESLint member resolution
    const safeDto = dto as Record<string, any>;

    // 1. If it's an update operation on a specific record instance
    if (safeDto.id) {
      const existing = await this.galleryRepo.findOne({
        where: { id: Number(safeDto.id), user_id: targetUserId },
      });
      if (!existing) {
        throw new NotFoundException(
          `Gallery entry ID ${safeDto.id} not found for user.`,
        );
      }

      // Explicitly typing updateData prevents TypeScript from barking at dynamically added properties
      const updateData: Partial<GalleryEntity> & { updated_at: Date } = {
        status: statusValue,
        updated_at: new Date(),
      };

      if (safeDto.image_url && String(safeDto.image_url).trim().length > 0) {
        updateData.image_url = String(safeDto.image_url).trim();
        updateData.gallery_images = '';
      } else if (files && files.length > 0) {
        updateData.image_url = null;
        updateData.gallery_images = JSON.stringify([files[0].filename]);
      }

      await this.galleryRepo.update({ id: existing.id }, updateData);
      return {
        message: 'Gallery image entry modified successfully',
        status: true,
      };
    }

    // 2. New external image link creation path
    if (safeDto.image_url && String(safeDto.image_url).trim().length > 0) {
      const record = this.galleryRepo.create({
        user_id: targetUserId,
        image_url: String(safeDto.image_url).trim(),
        gallery_images: '',
        status: statusValue,
        created_at: new Date(),
      });
      createdRecords.push(await this.galleryRepo.save(record));
    }

    // 3. New local multi-file upload allocation path loop
    if (files && files.length > 0) {
      for (const file of files) {
        const record = this.galleryRepo.create({
          user_id: targetUserId,
          image_url: null,
          gallery_images: JSON.stringify([file.filename]),
          status: statusValue,
          created_at: new Date(),
        });
        createdRecords.push(await this.galleryRepo.save(record));
      }
    }

    if (createdRecords.length === 0) {
      throw new BadRequestException(
        'Image web link or local file upload asset is required.',
      );
    }

    return {
      message: 'Gallery data created successfully.',
      status: true,
    };
  }

  // ==========================================
  //  PATCH VISIBILITY STATUS METHOD
  // ==========================================
  public async toggle_status(targetUserId: number, id: number, status: number) {
    const record = await this.galleryRepo.findOne({
      where: { id, user_id: targetUserId },
    });
    if (!record) {
      throw new NotFoundException('Gallery image record not found');
    }

    await this.galleryRepo.update({ id }, { status, updated_at: new Date() });
    return {
      message: 'Image panel view status flag visibility updated.',
      status: true,
    };
  }

  // ==========================================
  //  DELETE METHOD (Authentic Row Dropping)
  // ==========================================
  public async deleteGalleryItem(id: number) {
    const record = await this.galleryRepo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(
        `Gallery asset line record not found for ID: ${id}`,
      );
    }
    await this.galleryRepo.remove(record);
    return {
      message: 'Gallery entry dropped from database engine successfully.',
    };
  }
}
