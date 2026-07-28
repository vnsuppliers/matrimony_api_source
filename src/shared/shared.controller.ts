import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SharedService } from './shared.service';


@Controller('shared')
export class SharedController {
  constructor(private readonly sharedService: SharedService) {}
@UseGuards(JwtAuthGuard)
  @Get('/me/get-profile-image')
  public async getProfileImage(@Req() req) {
    return await this.sharedService.getProfileImage(req.user.id);
  }

  /**
   * get global success stories & ratings.
   */
  @Get('/get-success-story-ratings')
  async get_success_story_ratings() {
    return await this.sharedService.get_active_success_story_ratings();
  }
}
