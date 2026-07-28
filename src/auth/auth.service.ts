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
    const user = await this.userService.validate_user(email, password);

    // ==========================================
    // FIXED SECURITY CHECK: is_verified Matrix
    // ==========================================

    // 4 -> Deleted (This is the ONLY state that completely rejects a login attempt)
    if (user.is_verified === 4) {
      throw new UnauthorizedException(
        'Your account has been deleted and cannot be accessed.',
      );
    }

    //  REMOVED: Status 0, 2, and 3 exceptions have been cleared out from here!
    // This allows them to receive their token so our specialized frontend views
    // can display the descriptive warning banners we built.

    // ==========================================

    const member = await this.userService.findMemberByUserId(user.id);

    // Appending is_verified status inside the signed token payload so middleware can read it safely
    const payload = {
      sub: user.id,
      email: user.email,
      gender_id: member ? member.gender_id : null,
      role_id: user.role_id,
      is_verified: user.is_verified,
    };

    const access_token = await this.jwtService.signAsync(payload);
    // console.log(payload);
    return {
      message: 'Login successful',
      access_token,
      user: {
        id: encryptId(user.id),
        role_id: user.role_id,
        is_verified: user.is_verified, // Shared back to frontend layout controllers
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
