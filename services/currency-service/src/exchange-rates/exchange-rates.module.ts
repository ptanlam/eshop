import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CurrenciesController } from '../currencies/currencies.controller';
import exchangeRateConfig from './exchange-rate.config';
import { ExchangeRatesController } from './exchange-rates.controller';
import { exchangeRatesProvider } from './exchange-rates.provider';
import { ExchangeRatesService } from './exchange-rates.service';

@Module({
  imports: [
    ConfigModule.forFeature(exchangeRateConfig),
    ScheduleModule.forRoot(),
    HttpModule.registerAsync({
      useFactory: () => ({ timeout: 5000, maxRedirects: 5 }),
    }),
  ],
  controllers: [ExchangeRatesController, CurrenciesController],
  providers: [ExchangeRatesService, ...exchangeRatesProvider],
  exports: [ExchangeRatesService],
})
export class ExchangeRatesModule {}
