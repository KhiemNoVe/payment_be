import { Module } from '@nestjs/common';
import { PaymentService } from './service';
import { PaymentController } from './controller';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [],
})
export class PaymentModule {}
