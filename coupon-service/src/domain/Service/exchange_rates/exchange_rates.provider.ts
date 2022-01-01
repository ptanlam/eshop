import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { exchangeRatesProvideToken } from '../../../constants';

export const exchangeRatesProvider = [
  {
    provide: exchangeRatesProvideToken,
    useFactory: (configService: ConfigService) => {
      return ClientProxyFactory.create({
        transport: Transport.GRPC,
        options: {
          package: 'exchange_rates',
          protoPath: join(__dirname, './exchange_rates.proto'),
          url: configService.get('EXCHANGE_GRPC_CONNECTION_URL'),
        },
      });
    },
    inject: [ConfigService],
  },
];
