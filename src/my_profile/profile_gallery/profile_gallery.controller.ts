import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Patch,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { decryptId } from 'src/common/utils/encryption.util';
import { ProfileGalleryService } from './profile_gallery.service';
import { GalleryDto } from 'src/dto/gallery.dto';
import { PremiumGuard } from 'src/auth/guards/premium.guard';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';
import { createMulterConfig } from 'src/config/multer.config';

@UseGuards(JwtAuthGuard, PremiumGuard, AccountStatusGuard)
@Controller('profile-gallery')
export class ProfileGalleryController {
  constructor(private readonly profileGalleryService: ProfileGalleryService) {}

  private getDecryptedUserId(encryptedId: string): number {
    if (!isNaN(Number(encryptedId))) return Number(encryptedId);
    try {
      const decrypted = decryptId(encryptedId);
      const user_id = Number(decrypted);
      if (isNaN(user_id)) throw new Error();
      return user_id;
    } catch {
      throw new BadRequestException('Invalid User ID');
    }
  }

  @Get(':user_id')
  public async get_gallery(@Param('user_id') encryptedId: string) {
    const user_id = this.getDecryptedUserId(encryptedId);
    return this.profileGalleryService.get_gallery(user_id);
  }

  @Post('/update-create/:user_id')
  @UseInterceptors(
    FilesInterceptor('gallery_images', 10, createMulterConfig('gallery')),
  )
  public async update_create(
    @Param('user_id') encryptedId: string,
    @Body() dto: GalleryDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const user_id = this.getDecryptedUserId(encryptedId);

    const MAX_SIZE = 5 * 1024 * 1024;
    if (files) {
      for (const file of files) {
        if (file.size > MAX_SIZE) {
          throw new BadRequestException(
            `File "${file.originalname}" exceeds 5MB.`,
          );
        }
      }
    }
    return this.profileGalleryService.update_create(user_id, dto, files);
  }

  // REAL DELETE ROUTE METHOD
  @Delete('/:user_id/:id')
  public async delete_item(
    @Param('user_id') encryptedId: string,
    @Param('id') id: string,
  ) {
    const user_id = this.getDecryptedUserId(encryptedId);
    return this.profileGalleryService.delete_gallery_item(user_id, Number(id));
  }

  // DEDICATED PATCH STATUS ROUTE
  @Patch('/status/:user_id/:id')
  public async toggle_status(
    @Param('user_id') encryptedId: string,
    @Param('id') id: string,
    @Body('status') status: number,
  ) {
    const user_id = this.getDecryptedUserId(encryptedId);
    if (status !== 0 && status !== 1) {
      throw new BadRequestException('Status value must be either 0 or 1');
    }
    return this.profileGalleryService.toggle_status(
      user_id,
      Number(id),
      status,
    );
  }
}
