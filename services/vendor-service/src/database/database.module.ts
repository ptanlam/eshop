import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import { databaseProvider } from './database.provider';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [...databaseProvider],
  exports: [...databaseProvider],
})
export class DatabaseModule {}
