import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesService } from '../../domain/services';
import { filesProvider } from '../providers';

@Module({
  imports: [ConfigModule],
  providers: [...filesProvider, FilesService],
  exports: [...filesProvider, FilesService],
})
export class FilesModule {}
