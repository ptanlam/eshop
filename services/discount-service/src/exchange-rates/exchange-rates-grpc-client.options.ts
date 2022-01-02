import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { exchangeRatesToken } from '../constants';

export const exchangeProvider = [
  {
    provide: exchangeRatesToken,
    useFactory: (configService: ConfigService) => {
      return ClientProxyFactory.create({
        transport: Transport.GRPC,
        options: {
          package: 'exchange_rates',
          protoPath: join(__dirname, './exchange-rates.proto'),
          url: configService.get<string>('EXCHANGE_GRPC_CONNECTION_URL'),
        },
      });
    },
    inject: [ConfigService],
  },
];
