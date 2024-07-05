import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as braintree from 'braintree';
import { PaymentDto, RefundDto } from '../dtos';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private gateway: braintree.BraintreeGateway;

  constructor(private readonly config: ConfigService) {
    this.gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: this.config.get('MERCHANT_ID'),
      publicKey: this.config.get('PUBLIC_KEY'),
      privateKey: this.config.get('PRIVATE_KEY'),
    });
  }

  async getToken(): Promise<string> {
    try {
      const response = await this.gateway.clientToken.generate({});
      return response.clientToken;
    } catch (error) {
      throw new Error('Failed to generate client token');
    }
  }

  async processPayment({ amount, nonce }: PaymentDto) {
    try {
      const result = await this.gateway.transaction.sale({
        amount,
        orderId: uuidv4(),
        customer: {
          firstName: 'khiem',
          lastName: 'nv',
          email: 'khiemnv.work@gmail.com',
        },
        paymentMethodNonce: nonce,
        options: { submitForSettlement: true },
      });

      if (result.success) {
        await this.gateway.testing.settle(result.transaction.id);
      } else {
        console.error(result.message);
      }

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async refundPayment(refundData: RefundDto): Promise<any> {
    const transaction = await this.gateway.transaction.find(
      refundData.transactionId,
    );

    const result = await this.gateway.transaction.refund(
      refundData.transactionId,
    );

    if (result.success) {
      return result.transaction;
    } else {
      throw new Error(result.message);
    }
  }

  async handleWebhook(webhookData: any): Promise<any> {
    const webhookNotification = await this.gateway.webhookNotification.parse(
      webhookData.bt_signature,
      webhookData.bt_payload,
    );
    console.log(
      '🚀 ~ PaymentService ~ handleWebhook ~ webhookNotification:',
      webhookNotification,
    );

    // Process the webhook notification as needed
    this.logger.log(
      `Received webhook notification: ${webhookNotification.kind}`,
    );

    return webhookNotification;
  }

  async getTransactionHistory(userId: string): Promise<any> {
    const transactions = await this.gateway.transaction.search((search) => {
      search.customerId().is(userId);
    });

    const results = [];
    await transactions.each((transaction) => results.push(transaction));

    return results;
  }
}
