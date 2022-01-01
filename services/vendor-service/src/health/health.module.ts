import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { TerminusModule } from '@nestjs/terminus';
import databaseConfig from '../database/database.config';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    ConfigModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mssql',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
