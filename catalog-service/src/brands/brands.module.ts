import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { brandsProvider } from './brands-grpc-client.option';
import { BrandsService } from './brands.service';

@Module({
  imports: [ConfigModule],
  providers: [...brandsProvider, BrandsService],
  exports: [...brandsProvider, BrandsService],
})
export class BrandsModule {}
