import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { discountProvider } from './discounts-grpc-client.options';
import { DiscountsService } from './discounts.service';

@Module({
  imports: [ConfigModule],
  providers: [...discountProvider, DiscountsService],
  exports: [...discountProvider, DiscountsService],
})
export class DiscountsModule {}
