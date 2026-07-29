import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      status: 'success',
      message: 'Matrimony API is running successfully',
    };
  }
}