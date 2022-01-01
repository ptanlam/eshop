import { Module } from '@nestjs/common';
import { S3Module } from '../s3/s3.module';
import { FilesController } from './files.controller';
import { filesProvider } from './files.provider';
import { FilesService } from './files.service';

@Module({
  imports: [S3Module],
  controllers: [FilesController],
  providers: [FilesService, ...filesProvider],
  exports: [FilesService, ...filesProvider],
})
export class FilesModule {}
