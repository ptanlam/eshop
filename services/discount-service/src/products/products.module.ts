import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { productProvider } from './products.provider';
import { ProductsService } from './products.service';

@Module({
  providers: [ProductsService, ...productProvider],
  exports: [ProductsService],
})
export class ProductsModule {}
