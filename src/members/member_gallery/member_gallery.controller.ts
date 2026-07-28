import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MemberGalleryService } from './member_gallery.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';
import { PremiumGuard } from 'src/auth/guards/premium.guard';

@UseGuards(JwtAuthGuard, AccountStatusGuard, PremiumGuard)
@Controller('member-gallery')
export class MemberGalleryController {
  constructor(private readonly memberGalleryService: MemberGalleryService) {}

  // FIX: Parameter passed to Param matches target token string exactly
  @Get('/get-member-gallery-images/:userId')
  async get_gallery_images(@Param('userId') userId: number) {
    return await this.memberGalleryService.get_gallery_images(userId);
  }
}
