import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { filesPackageProvideToken } from '../constants';

export const filesProvider = [
  {
    provide: filesPackageProvideToken,
    useFactory: (configService: ConfigService) => {
      return ClientProxyFactory.create({
        transport: Transport.GRPC,
        options: {
          package: 'files',
          protoPath: join(__dirname, './files.proto'),
          url: process.env.STORAGE_GRPC_CONNECTION_URL,
        },
      });
    },
    inject: [ConfigService],
  },
];
