import { Body, Controller, Post, Req } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh-session')
  async refreshSessio(@Req() req: any) {
    // req.user comes directly from your JwtStrategy execution
    return this.authService.refreshTokenByUserId(req.user.id);
  }
}
