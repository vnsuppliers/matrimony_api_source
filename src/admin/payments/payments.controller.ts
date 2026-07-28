import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { CreateOrderDto } from 'src/dto/payments/create-order.dto';
import { VerifyPaymentDto } from 'src/dto/payments/verify-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('/payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  async createOrder(@Req() req, @Body() dto: CreateOrderDto) {
    return this.paymentsService.createOrder(req.user.id, dto);
  }

  @Post('verify-payment')
  async verifyPayment(@Req() req, @Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(req.user.id, dto);
  }

  @Get('my-subscription')
  async mySubscription(@Req() req) {
    return this.paymentsService.getMySubscription(req.user.id);
  }
}
