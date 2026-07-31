import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { createMulterConfig } from 'src/config/multer.config';
import { ProfileSettingsService } from './profile_settings.service';
import { UpdateProfileDto } from '../../dto/update-profile.dto';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';
import { readdirSync } from 'fs';
import { join } from 'path';

@UseGuards(JwtAuthGuard, AccountStatusGuard)
@Controller('profile-settings')
export class ProfileSettingsController {
  private readonly logger = new Logger(ProfileSettingsController.name);
  constructor(
    private readonly profileSettingsService: ProfileSettingsService,
  ) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    return this.profileSettingsService.get_profile(req.user.id);
  }

  // TEMPORARY - REMOVE AFTER DEBUGGING
  @Get('/debug-uploads')
  debugUploads() {
    try {
      const files = readdirSync(join(process.cwd(), 'uploads', 'profile_pictures'));
      return { cwd: process.cwd(), files };
    } catch (err: any) {
      return { cwd: process.cwd(), error: err.message };
    }
  }

  @Put('/update')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profile_image', createMulterConfig('profile_pictures')),
  )
  async updateProfile(
    @Req() req: any,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.profileSettingsService.update_profile(req.user.id, dto, file);
  }
}
