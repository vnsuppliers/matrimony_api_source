import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TermsConditionsService } from './terms_conditions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTermsConditionsDto } from 'src/dto/create-terms-conditions.dto';

@Controller('terms-conditions')
export class TermsConditionsController {
  constructor(
    private readonly termsConditionsService: TermsConditionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-update')
  async create_update(
    @Query('id', new ParseIntPipe({ optional: true })) id = 0,
    @Body() payload: CreateTermsConditionsDto,
  ) {
    return this.termsConditionsService.updateCreate(Number(id) || 0, payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-terms-conditions')
  async get_terms_conditions(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('search') search = '',
  ) {
    return this.termsConditionsService.get_terms_conditions(page, search);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.termsConditionsService.remove(id);
  }

  /**
   * Get active terms & conditions for public viewing (No Guards!)
   */
  @Get('/get-active-terms-conditions')
  async get_active_terms_conditions() {
    // FIXED: Call the service instead of calling itself recursively
    return this.termsConditionsService.get_active_terms_conditions();
  }
}
