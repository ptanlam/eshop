import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const productsGrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'products',
    protoPath: join(__dirname, './products.proto'),
    url: process.env.GRPC_CONNECTION_URL,
  },
};
