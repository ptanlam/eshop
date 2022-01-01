import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../configs/database.config';
import { databaseProvider } from '../providers';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [...databaseProvider],
  exports: [...databaseProvider],
})
export class DatabaseModule {}
