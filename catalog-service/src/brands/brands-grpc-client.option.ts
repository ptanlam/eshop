import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { brandPackageToken } from '../constants';

export const brandsProvider = [
  {
    provide: brandPackageToken,
    useFactory: (configService: ConfigService) => {
      return ClientProxyFactory.create({
        transport: Transport.GRPC,
        options: {
          package: 'vendors',
          protoPath: join(__dirname, './vendors.proto'),
          url: configService.get('BRAND_GRPC_CONNECTION_URL'),
        },
      });
    },
    inject: [ConfigService],
  },
];
