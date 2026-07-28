import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { PhysicalAttributesService } from './physical_attributes.service';
import { CreateUpdatePhysicalAttributesDto } from 'src/dto/create_update_physical_attributes.dto';
import { decryptId } from 'src/common/utils/encryption.util';

@Controller('physical-attributes')
export class PhysicalAttributesController {
  constructor(
    private readonly physicalAttributesService: PhysicalAttributesService,
  ) {}

  // ================= GET =================
  @Get(':user_id')
  async get(@Param('user_id') incomingId: string) {
    const user_id = this.parseOrDecryptUserId(incomingId);
    return this.physicalAttributesService.get_physical_attributes(user_id);
  }

  // ================= UPSERT =================
  @Post('/update-create/:user_id')
  async createUpdate(
    @Param('user_id') incomingId: string,
    @Body() dto: CreateUpdatePhysicalAttributesDto,
  ) {
    const user_id = this.parseOrDecryptUserId(incomingId);
    return this.physicalAttributesService.update_create_physical_attributes(
      user_id,
      dto,
    );
  }

  // ================= UTIL =================
  private parseOrDecryptUserId(incomingId: string): number {
    // If it's already a clean numeric string from the dashboard (e.g. "3"), parse it directly
    if (!isNaN(Number(incomingId))) {
      return Number(incomingId);
    }

    // Otherwise, treat it as a ciphertext string and attempt decryption
    try {
      // Decode URL encoding first before decrypting
      const decoded = decodeURIComponent(incomingId);
      const decrypted = decryptId(decoded);

      const user_id = Number(decrypted);
      if (isNaN(user_id)) throw new Error();

      return user_id;
    } catch {
      throw new BadRequestException('Invalid User ID');
    }
  }
}
