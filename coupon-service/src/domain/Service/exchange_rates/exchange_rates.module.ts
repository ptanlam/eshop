import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { exchangeRatesProvider } from './exchange_rates.provider';
import { ExchangeService } from './exchange_rates.service';

@Module({
  imports: [ConfigModule],
  providers: [...exchangeRatesProvider, ExchangeService],
  exports: [...exchangeRatesProvider, ExchangeService],
})
export class ExchangeModule {}
