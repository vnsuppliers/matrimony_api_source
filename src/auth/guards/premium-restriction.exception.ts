import { HttpException, HttpStatus } from '@nestjs/common';

export class PremiumRestrictionException extends HttpException {
  constructor(message: string = 'Upgrade to Premium to unlock this feature') {
    super(
      {
        statusCode: HttpStatus.PAYMENT_REQUIRED, // 402 Error Code
        error: 'Payment Required',
        message: message,
        requires_premium: true,
      },
      HttpStatus.PAYMENT_REQUIRED,
    );
  }
}
