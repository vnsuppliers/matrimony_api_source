import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { encryptId } from 'src/common/utils/encryption.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

public async login(email: string, password: string) {
  console.log('LOGIN REQUEST:', email);

  const user = await this.userService.validate_user(email, password);

  console.log('USER FOUND:', user?.id);

  const member = await this.userService.findMemberByUserId(user.id);

  console.log('MEMBER FOUND:', member);

  const payload = {
    sub: user.id,
    email: user.email,
    gender_id: member ? member.gender_id : null,
    role_id: user.role_id,
    is_verified: user.is_verified,
  };

  console.log('JWT PAYLOAD:', payload);

  const access_token = await this.jwtService.signAsync(payload);

  return {
    message: 'Login successful',
    access_token,
    user: {
      id: encryptId(user.id),
      role_id: user.role_id,
      is_verified: user.is_verified,
    },
  };
}

  // Add this method inside your AuthService class
  public async refreshTokenByUserId(userId: number) {
    const user = await this.userService.findUserById(userId, {
      withDeleted: true,
    });
    if (!user || user.is_verified === 4) {
      throw new UnauthorizedException(
        'Account is inactive or has been deleted.',
      );
    }

    const member = await this.userService.findMemberByUserId(user.id);

    // Sign a brand new payload with the updated live database values
    const payload = {
      sub: user.id,
      email: user.email,
      gender_id: member ? member.gender_id : null,
      role_id: user.role_id,
      is_verified: user.is_verified, // Fresh live DB value
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'Token refreshed successfully',
      access_token,
      user: {
        id: encryptId(user.id),
        role_id: user.role_id,
        is_verified: user.is_verified,
      },
    };
  }
}
