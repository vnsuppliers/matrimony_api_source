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
    // this.logger.log(`File received: ${JSON.stringify(file)}`);
    // this.logger.log(`DTO received: ${JSON.stringify(dto)}`);
    return this.profileSettingsService.update_profile(req.user.id, dto, file);
  }
}
