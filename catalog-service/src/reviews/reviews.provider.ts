import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { reviewsPackageProvideToken } from '../constants';

export const reviewsProvider = [
  {
    provide: reviewsPackageProvideToken,
    useFactory: (configService: ConfigService) => {
      return ClientProxyFactory.create({
        transport: Transport.GRPC,
        options: {
          package: 'reviews',
          protoPath: join(__dirname, './reviews.proto'),
          url: configService.get('REVIEW_GRPC_CONNECTION_URL'),
        },
      });
    },
    inject: [ConfigService],
  },
];
