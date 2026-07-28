import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PremiumRestrictionException } from './premium-restriction.exception';

@Injectable()
export class PremiumGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Now user.is_premium will reflect the fresh, true database state on every single request call!
    if (!user || Number(user.is_premium) !== 1) {
      throw new PremiumRestrictionException();
    }

    return true;
  }
}
