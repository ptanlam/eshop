import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProductDiscount } from '../entities/productDiscount.entity';
import { Product } from '../entities/products.entity';

export const productProvider = [
  {
    provide: 'PRODUCT_REPOSITORY',
    useValue: Product,
  },
  {
    provide: 'PRODUCT_DISCOUNT_REPOSITORY',
    useValue: ProductDiscount,
  },
  {
    provide: 'PRODUCT_PACKAGE',
    useFactory: (configService: ConfigService) => {
      return ClientProxyFactory.create({
        transport: Transport.GRPC,
        options: {
          package: 'products',
          protoPath: join(__dirname, './products.proto'),
          url: process.env.PRODUCT_GRPC_CONNECTION_URL,
        },
      });
    },
    inject: [ConfigService],
  },
];
