import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { reactionsPackageProvideToken } from '../../constants';

export const reactionsProvider = [
  {
    provide: reactionsPackageProvideToken,
    useFactory: (configService: ConfigService) => {
      return ClientProxyFactory.create({
        transport: Transport.GRPC,
        options: {
          package: 'reactions',
          protoPath: join(__dirname, '../../domain/protos/reactions.proto'),
          url: configService.get('REACTION_GRPC_CONNECTION_URL'),
        },
      });
    },
    inject: [ConfigService],
  },
];
