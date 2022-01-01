import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './files/files.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.development', '.env'] }),
    FilesModule,
    MessagingModule,
    DatabaseModule,
  ],
})
export class AppModule {}
