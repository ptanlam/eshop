import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { exchangeRatesToken } from '../constants';
import { exchangeProvider } from './exchange-rates-grpc-client.options';
import { ExchangeRatesService } from './exchange-rates.service';

@Module({
  imports: [ConfigModule],
  providers: [...exchangeProvider, ExchangeRatesService],
  exports: [...exchangeProvider, ExchangeRatesService],
})
export class ExchangeRateModule {}
