import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'vendors',
      protoPath: join(__dirname, 'vendors/vendors.proto'),
      url: configService.get('GRPC_CONNECTION_URL'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('PORT') || 3004);
  console.log(`Vendor service is running on: ${await app.getUrl()}`);
}
bootstrap();
