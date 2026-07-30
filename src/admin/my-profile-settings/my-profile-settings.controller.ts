import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { createMulterConfig } from 'src/config/multer.config';
import { AdminProfileSettingsDto } from 'src/dto/admin_profile_settings.dto';
import { MyProfileSettingsService } from './my-profile-settings.service';

@UseGuards(JwtAuthGuard)
@Controller('my-profile-settings')
export class MyProfileSettingsController {
  constructor(
    private readonly myProfileSettingsService: MyProfileSettingsService,
  ) {}

  @Get('/get-my-profile/:userId')
  async get_profile(@Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.myProfileSettingsService.get_my_profile(userId);
  }

  @Put('/update')
  @UseInterceptors(
    FileInterceptor('profile_image', createMulterConfig('profile_pictures')),
  )
  async updateProfile(
    @Req() req: any,
    @Body() dto: AdminProfileSettingsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.myProfileSettingsService.updateCreate(userId, dto, file);
  }
}
