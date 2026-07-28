import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import { BYPASS_STATUS_CHECK_KEY } from '../decorators/bypass-status-check.decorator';
import { AccountStatus } from 'src/user/enums/user-status.enum';

interface RequestWithUser extends Request {
  user: {
    id: number;
    [key: string]: any;
  };
}

@Injectable()
export class AccountStatusGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isBypassRoute = this.reflector.getAllAndOverride<boolean>(
      BYPASS_STATUS_CHECK_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isBypassRoute) return true;

    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const tokenUser = req.user;

    if (!tokenUser || !tokenUser.id) return true;

    // Fetch the absolute freshest state directly from the database table
    const liveUser = await this.userRepo.findOne({
      where: { id: tokenUser.id },
      select: ['id', 'account_status', 'is_verified', 'account_status_message'],
    });

    // console.log('Live user data', liveUser);

    if (!liveUser) return true;

    // Blocked check
    if (liveUser.account_status === AccountStatus.BLOCKED) {
      throw new ForbiddenException({
        statusCode: 403,
        message:
          liveUser.account_status_message ||
          'Your account has been blocked by the administrator.',
        errorCode: 'BLOCKED',
      });
    }

    // Under Review check
    if (liveUser.is_verified === 0) {
      throw new ForbiddenException({
        statusCode: 403,
        message:
          liveUser.account_status_message ||
          'Our moderation team is securely reviewing your profile details. Full exploration tools will open up shortly.',
        errorCode: 'UNDER_REVIEW',
      });
    }

    // Suspended check
    if (
      liveUser.is_verified === 2 ||
      liveUser.account_status === AccountStatus.SUSPENDED
    ) {
      throw new ForbiddenException({
        statusCode: 403,
        message:
          liveUser.account_status_message || 'Your account has been suspended.',
        errorCode: 'SUSPENDED',
      });
    }

    // Deactivated check
    if (
      liveUser.is_verified === 3 ||
      liveUser.account_status === AccountStatus.DEACTIVATED
    ) {
      throw new ForbiddenException({
        statusCode: 403,
        message:
          liveUser.account_status_message ||
          'Your account has been deactivated.',
        errorCode: 'DEACTIVATED',
      });
    }

    return true;
  }
}
