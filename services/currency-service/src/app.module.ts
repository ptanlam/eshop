import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ExchangeRatesModule } from './exchange-rates/exchange-rates.module';

@Module({
  imports: [
    ExchangeRatesModule,
    ConfigModule.forRoot({ envFilePath: ['.env.development', '.env'] }),
    DatabaseModule,
  ],
  providers: [],
})
export class AppModule {}
