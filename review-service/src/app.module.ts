import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  DatabaseModule,
  HealthModule,
  ReviewsModule,
} from './infrastructure/modules';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        GRPC_CONNECTION_URL: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        STORAGE_GRPC_CONNECTION_URL: Joi.string().required(),
        REACTION_GRPC_CONNECTION_URL: Joi.string().required(),
      }),
    }),
    HealthModule,
    ReviewsModule,
    DatabaseModule,
  ],
})
export class AppModule {}
