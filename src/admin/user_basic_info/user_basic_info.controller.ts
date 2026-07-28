import {
  Body,
  Controller,
  Put,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { createMulterConfig } from 'src/config/multer.config';

import {
  UserBasicInfoService,
  UpdateBasicProfileDto,
} from './user_basic_info.service';

@UseGuards(JwtAuthGuard)
@Controller('user-basic-info')
export class UserBasicInfoController {
  private readonly logger = new Logger(UserBasicInfoController.name);

  constructor(private readonly userBasicInfoService: UserBasicInfoService) {}

  @Put('update-create/:userId')
  @UseInterceptors(
    FileInterceptor('profile_image', createMulterConfig('profile_pictures')),
  )
  async update_create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateBasicProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // this.logger.log(dto);
    // this.logger.log(file);

    return this.userBasicInfoService.update_create(userId, dto, file);
  }
}
