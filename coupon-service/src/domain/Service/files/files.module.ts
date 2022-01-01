import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { filesProvider } from './files.provider';
import { FilesService } from './files.service';

@Module({
  imports: [ConfigModule],
  providers: [...filesProvider, FilesService],
  exports: [...filesProvider, FilesService],
})
export class FilesModule {}
