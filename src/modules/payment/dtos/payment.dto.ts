import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentDto {
  @ApiProperty({
    description: 'The amount of the payment',
    type: Number,
    example: 100.0,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The payment method nonce from Braintree',
    type: String,
    example: 'fake-valid-nonce',
  })
  @IsString()
  nonce: string;
}

export class RefundDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  transactionId: string;
}
