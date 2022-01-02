import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const discountsGrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'discounts',
    protoPath: join(__dirname, './discounts.proto'),
    url: process.env.GRPC_CONNECTION_URL,
  },
};
