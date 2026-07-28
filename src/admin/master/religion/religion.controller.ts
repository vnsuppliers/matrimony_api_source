import { Controller, Get } from '@nestjs/common';
import { ReligionService } from './religion.service';

@Controller('master/religion')
export class ReligionController {
  constructor(private readonly religionService: ReligionService) {}

  // get all religions.
  @Get('/get_religions')
  async get_all() {
    return await this.religionService.get_all();
  }
}
