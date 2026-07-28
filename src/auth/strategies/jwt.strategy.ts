import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

interface JwtPayload {
  sub: number;
  email: string;
  gender_id: number;
  role_id: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const user = await this.userService.findUserById(payload.sub, {
      withDeleted: true,
    });

    if (!user) {
      throw new UnauthorizedException('User account no longer exists.');
    }

    if (user.is_verified === 4 || user.deleted_at !== null) {
      throw new UnauthorizedException(
        'Your account has been deleted and cannot be accessed.',
      );
    }

    return {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      is_verified: user.is_verified,
      is_premium: user.is_premium,
    };
  }
}
