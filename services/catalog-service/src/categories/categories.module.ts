import { Module } from '@nestjs/common';
import { FilesModule } from '../files/files.module';
import { MessagingModule } from '../messaging/messaging.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [FilesModule, MessagingModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
