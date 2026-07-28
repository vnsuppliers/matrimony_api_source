import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { decryptId } from 'src/common/utils/encryption.util';
import { CreateUpdateHobbiesInfoDto } from 'src/dto/create_update_hobbies_info.dto';
import { HobbiesInfoService } from './hobbies_info.service';

@UseGuards(JwtAuthGuard)
@Controller('hobbies-info')
export class HobbiesInfoController {
  constructor(private readonly hobbiesService: HobbiesInfoService) {}

  // ================= PARSE ID =================
  private parseId(incomingId: string): number {
    // If it's already a clean numeric string from the dashboard (e.g. "3"), parse it directly
    if (!isNaN(Number(incomingId))) {
      return Number(incomingId);
    }

    // Otherwise, treat it as a ciphertext string and attempt decryption
    try {
      const id = Number(decryptId(decodeURIComponent(incomingId)));

      if (isNaN(id)) {
        throw new Error();
      }

      return id;
    } catch {
      throw new BadRequestException('Invalid ID');
    }
  }

  // ================= GET =================
  @Get('/get/:user_id')
  getHobbiesInfo(
    @Param('user_id')
    incomingId: string,
  ) {
    const user_id = this.parseId(incomingId);

    return this.hobbiesService.get_hobbies_info(user_id);
  }

  // ================= CREATE =================
  @Post('/create/:user_id')
  createHobbiesInfo(
    @Param('user_id')
    incomingId: string,

    @Body()
    dto: CreateUpdateHobbiesInfoDto,
  ) {
    const user_id = this.parseId(incomingId);

    return this.hobbiesService.create_hobbies_info(user_id, dto);
  }

  // ================= UPDATE =================
  @Put('/update/:hobbies_info_id')
  updateHobbiesInfo(
    @Param('hobbies_info_id')
    incomingId: string,

    @Body()
    dto: CreateUpdateHobbiesInfoDto,
  ) {
    const hobbies_info_id = this.parseId(incomingId);

    return this.hobbiesService.update_hobbies_info(hobbies_info_id, dto);
  }

  // ================= DELETE =================
  @Delete('/delete/:hobbies_info_id')
  deleteHobbiesInfo(
    @Param('hobbies_info_id')
    incomingId: string,
  ) {
    const hobbies_info_id = this.parseId(incomingId);

    return this.hobbiesService.delete_hobbies_info(hobbies_info_id);
  }
}
