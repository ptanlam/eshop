import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { catalogPackageProvideToken } from '../constants';

export const catalogProvider = [
  {
    provide: catalogPackageProvideToken,
    useFactory: (configService: ConfigService) => {
      return ClientProxyFactory.create({
        transport: Transport.GRPC,
        options: {
          package: 'products',
          protoPath: join(__dirname, './catalog.proto'),
          url: configService.get('CATALOG_GRPC_CONNECTION_URL'),
        },
      });
    },
    inject: [ConfigService],
  },
];
