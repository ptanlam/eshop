import { Module } from '@nestjs/common';
import { CatalogModule } from '../catalog/catalog.module';
import { FilesModule } from '../files/files.module';
import { MessagingModule } from '../messaging/messaging.module';
import { VendorsController } from './vendors.controller';
import { vendorsProvider } from './vendors.provider';
import { VendorsService } from './vendors.service';

@Module({
  imports: [MessagingModule, FilesModule, CatalogModule],
  controllers: [VendorsController],
  providers: [VendorsService, ...vendorsProvider],
})
export class VendorsModule {}
