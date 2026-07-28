import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { SuccessStoryService } from './success_story.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';
import { decryptId } from 'src/common/utils/encryption.util';
import {
  editFileName,
  imageFileFilter,
} from '../../common/utils/file-upload.util';
import { CreateSuccessStoryDto } from 'src/dto/create-success-story.dto';

@UseGuards(JwtAuthGuard, AccountStatusGuard)
@Controller('success-story')
export class SuccessStoryController {
  constructor(private readonly successStoryService: SuccessStoryService) {}

  @Get(':user_id')
  public async get_success_story(@Param('user_id') encryptedId: string) {
    let user_id: number;

    // Check if parameter is directly numeric
    if (!isNaN(Number(encryptedId))) {
      user_id = Number(encryptedId);
    } else {
      try {
        const decrypted = decryptId(encryptedId);
        user_id = Number(decrypted);
        if (isNaN(user_id)) throw new Error();
      } catch {
        throw new BadRequestException('Invalid User ID');
      }
    }

    return this.successStoryService.get_success_story(user_id);
  }

  @Post('/update-create/:user_id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/success_stories',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  public async create_success_story(
    @Param('user_id') incomingId: string,
    @Body() dto: CreateSuccessStoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    let user_id: number;

    if (!isNaN(Number(incomingId))) {
      user_id = Number(incomingId);
    } else {
      try {
        const decrypted = decryptId(incomingId);
        user_id = Number(decrypted);

        if (isNaN(user_id)) throw new Error();
      } catch {
        throw new BadRequestException('Invalid User ID format during creation');
      }
    }

    if (image) {
      dto.image = image.filename;
    }

    return this.successStoryService.update_create_success_story(user_id, dto);
  }
}
