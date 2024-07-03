import { Module } from '@nestjs/common';
import { PaymentModule } from '../payment';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PaymentModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
