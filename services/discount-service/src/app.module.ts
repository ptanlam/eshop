import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { DiscountsModule } from './discounts/discount.module';
import { DiscountsController } from './discounts/discounts.controller';
import { ExchangeRateModule } from './exchange-rates/exchange-rates.module';
import { FilesModule } from './files/files.module';
import { MessagingModule } from './messaging/messaging.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      isGlobal: true,
    }),
    DatabaseModule,
    DiscountsModule,
    ProductsModule,
    ExchangeRateModule,
    FilesModule,
    MessagingModule,
  ],
  controllers: [DiscountsController],
})
export class AppModule {}
