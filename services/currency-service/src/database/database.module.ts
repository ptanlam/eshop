import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import { databaseProviders } from './database.providers';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
