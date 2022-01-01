import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { VendorsModule } from './vendors/vendors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        GRPC_CONNECTION_URL: Joi.string().required(),
        CATALOG_GRPC_CONNECTION_URL: Joi.string().required(),
        STORAGE_GRPC_CONNECTION_URL: Joi.string().required(),
      }),
    }),
    HealthModule,
    VendorsModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
