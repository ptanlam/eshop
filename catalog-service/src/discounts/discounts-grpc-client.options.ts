import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { discountPackageProvideToken } from '../constants';

export const discountProvider = [
  {
    provide: discountPackageProvideToken,
    useFactory: (configService: ConfigService) => {
      return ClientProxyFactory.create({
        transport: Transport.GRPC,
        options: {
          package: 'discounts',
          protoPath: join(__dirname, './discounts.proto'),
          url: configService.get('DISCOUNT_GRPC_CONNECTION_URL'),
        },
      });
    },
    inject: [ConfigService],
  },
];
