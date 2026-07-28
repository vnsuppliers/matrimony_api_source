import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GalleryManagementService } from './gallery_management.service';
import { GalleryDto } from 'src/dto/gallery.dto';
import { createMulterConfig } from 'src/config/multer.config';

@UseGuards(JwtAuthGuard)
@Controller('gallery-management')
export class GalleryManagementController {
  constructor(
    private readonly galleryManagementService: GalleryManagementService,
  ) {}

  // FETCH TARGETED PROFILE IMAGES (ADMIN ACTIVE SCOPE)
  @Get('/:user_id')
  async getGallery(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.galleryManagementService.get_user_gallery(user_id);
  }

  // UPLOAD / UPDATE IMAGES FOR INDEPENDENT PROFILE ID
  @Post('/update-create')
  @UseInterceptors(
    FilesInterceptor('gallery_images', 10, createMulterConfig('gallery')),
  )
  async update_create(
    @Body() body: GalleryDto & { user_id?: string | number },
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (!body.user_id) {
      throw new BadRequestException(
        'The target profile user_id parameter is required inside the payload.',
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (files) {
      for (const file of files) {
        if (file.size > MAX_SIZE) {
          throw new BadRequestException(
            `File "${file.originalname}" exceeds maximum allowed size limits.`,
          );
        }
      }
    }

    return this.galleryManagementService.update_create(
      Number(body.user_id),
      body,
      files,
    );
  }

  // INDEPENDENT PRIVACY CONTROL FOR TARGET ELEMENT
  @Patch('/status/:user_id/:id')
  async toggleStatus(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ParseIntPipe) status: number,
  ) {
    if (status !== 0 && status !== 1) {
      throw new BadRequestException(
        'Status signature input parameter value must be 0 or 1.',
      );
    }
    return this.galleryManagementService.toggle_status(user_id, id, status);
  }

  // HARDFORCE PURGE LINE DELETION
  @Delete('/delete/:id')
  async deleteGalleryItem(@Param('id', ParseIntPipe) id: number) {
    return this.galleryManagementService.deleteGalleryItem(id);
  }
}
