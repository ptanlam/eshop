import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ExchangeRateModule } from '../exchange-rates/exchange-rates.module';
import { FilesModule } from '../files/files.module';
import { MessagingModule } from '../messaging/messaging.module';
import { ProductsModule } from '../products/products.module';
import { DiscountsController } from './discounts.controller';
import { discountsProvider } from './discounts.provider';
import { DiscountsService } from './discounts.service';

@Module({
  imports: [
    ProductsModule,
    DatabaseModule,
    DiscountsModule,
    FilesModule,
    ExchangeRateModule,
    MessagingModule,
  ],
  controllers: [DiscountsController],
  providers: [DiscountsService, ...discountsProvider],
  exports: [DiscountsService, ...discountsProvider],
})
export class DiscountsModule {}
