import { Controller, Get, Post, Body } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { PaymentDto, RefundDto } from '../dtos';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('token')
  async getToken(): Promise<{ token: string }> {
    const token = await this.paymentService.getToken();
    return { token };
  }

  @Post('process-payment')
  async processPayment(@Body() paymentData: PaymentDto) {
    try {
      const result = await this.paymentService.processPayment(paymentData);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  @Post('refund')
  async refundPayment(@Body() refundData: RefundDto) {
    try {
      const result = await this.paymentService.refundPayment(refundData);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  @Post('webhook')
  async handleWebhook(@Body() webhookData: any) {
    try {
      const result = await this.paymentService.handleWebhook(webhookData);
      console.log(
        '🚀 ~ PaymentController ~ handleWebhook ~ webhookData:',
        webhookData,
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
