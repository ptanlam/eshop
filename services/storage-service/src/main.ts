import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { config } from 'aws-sdk';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('s3.accessKeyId'),
    secretAccessKey: configService.get('s3.secretAccessKey'),
    region: configService.get('s3.region'),
  });

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'files',
      protoPath: join(__dirname, 'files/files.proto'),
      url: configService.get<string>('GRPC_CONNECTION_URL'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('PORT') || 3005);

  const logger = new Logger('Application');
  logger.log(`Storage service is running on ${await app.getUrl()}`);
}
bootstrap();
