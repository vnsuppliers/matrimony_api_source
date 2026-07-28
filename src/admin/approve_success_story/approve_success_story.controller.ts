import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { createMulterConfig } from 'src/config/multer.config';
import { ApproveSuccessStoryService } from './approve_success_story.service';
import { CreateSuccessStoryDto } from 'src/dto/create-success-story.dto';

@UseGuards(JwtAuthGuard)
@Controller('success-story')
export class ApproveSuccessStoryController {
  constructor(
    private readonly approveSuccessStoryService: ApproveSuccessStoryService,
  ) {}

  /**
   * 
   * @param page 
   * @returns 
   * Handle to get list of succes story & ratings.
   */
  @Get('approve-success-story/list')
  async getAllAdminStories(@Query('page') page?: string | number) {
    let parsedPage = 1;
    if (page !== undefined && page !== null && page !== '') {
      const num = Number(page);
      if (!isNaN(num)) {
        parsedPage = num;
      }
    }
    const finalPage = parsedPage < 1 ? 1 : parsedPage;
    return await this.approveSuccessStoryService.getAllAdminStories(finalPage);
  }

  /**
   * 
   * @param userId 
   * @param body 
   * @returns 
   * Handle the approve status of succes story & ratings.
   */
  @Post('approve-success-story/:userId')
  updateStatus(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { status: number; declineReason?: string },
  ) {
    return this.approveSuccessStoryService.updateSuccessStoryStatus(
      userId,
      body.status,
      body.declineReason,
    );
  }

  /**
   * 
   * @param memberId 
   * @returns
   * Handle the delete of succes story & ratings.
   */
  @Post('/delete-success-story-ratings/:memberId')
  async delete_success_story_ratings(
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
   return this.approveSuccessStoryService.delete_success_story_ratings(memberId);
  }

}
