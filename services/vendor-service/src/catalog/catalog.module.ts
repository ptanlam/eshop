import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { catalogProvider } from './catalog.provider';
import { CatalogService } from './catalog.service';

@Module({
  imports: [ConfigModule],
  providers: [...catalogProvider, CatalogService],
  exports: [...catalogProvider, CatalogService],
})
export class CatalogModule {}
