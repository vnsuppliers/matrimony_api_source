import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PrivacyPolicyService } from './privacy_policy.service';
import { CreatePrivacyPolicyDto } from 'src/dto/create_privacy_policy.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('privacy-policy')
export class PrivacyPolicyController {
  constructor(private readonly privacyPolicyService: PrivacyPolicyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-update')
  async update_create(
    @Query('id', new ParseIntPipe({ optional: true })) id = 0,
    @Body() payload: CreatePrivacyPolicyDto,
  ) {
    return this.privacyPolicyService.update_create(Number(id) || 0, payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/update-create-privacy-policy')
  async getAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('search') search = '',
  ) {
    return this.privacyPolicyService.getAll(page, search);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.privacyPolicyService.remove(id);
  }

  @Get('/get-active-privacy-policy')
  async get_active_privacy_policy() {
    return this.privacyPolicyService.get_active_privacy_policy();
  }
}
