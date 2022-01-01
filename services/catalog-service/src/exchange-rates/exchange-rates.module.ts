import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { exchangeRatesProvider } from './exchange-rates.provider';
import { ExchangeService } from './exchange-rates.service';

@Module({
  imports: [ConfigModule],
  providers: [...exchangeRatesProvider, ExchangeService],
  exports: [...exchangeRatesProvider, ExchangeService],
})
export class ExchangeModule {}
