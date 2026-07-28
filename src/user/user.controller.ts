import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { RegistrationDto } from 'src/dto/registration.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint for user registration
  @Post('/registration')
  public async registration(@Body() registrationDto: RegistrationDto) {
    return await this.userService.registration(registrationDto);
  }
}
